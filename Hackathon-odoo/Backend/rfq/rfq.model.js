const db = require("../src/config/db");

const RFQ = {
  create: (data, callback) => {
    db.query(
      "INSERT INTO rfqs (title, description, quantity, deadline, status, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.title,
        data.description,
        data.quantity,
        data.deadline,
        data.status || "Open",
        data.created_by
      ],
      (err, result) => {
        if (err) return callback(err);
        const rfqId = result.insertId;

        // If specific vendors are assigned, insert them into rfq_vendors
        if (data.vendorIds && data.vendorIds.length > 0) {
          const associations = data.vendorIds.map(vId => [rfqId, vId]);
          db.query(
            "INSERT INTO rfq_vendors (rfq_id, vendor_id) VALUES ?",
            [associations],
            (assocErr) => {
              if (assocErr) return callback(assocErr);
              callback(null, { id: rfqId, ...data });
            }
          );
        } else {
          callback(null, { id: rfqId, ...data });
        }
      }
    );
  },

  getAll: (filters, callback) => {
    let sql = `
      SELECT r.*, u.name as creator_name 
      FROM rfqs r 
      LEFT JOIN users u ON r.created_by = u.id 
      WHERE 1=1
    `;
    const params = [];

    // Filter by assigned vendor
    if (filters.vendorId) {
      sql += " AND r.id IN (SELECT rfq_id FROM rfq_vendors WHERE vendor_id = ?)";
      params.push(filters.vendorId);
    }

    if (filters.status) {
      sql += " AND r.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      sql += " AND (r.title LIKE ? OR r.description LIKE ?)";
      const searchVal = `%${filters.search}%`;
      params.push(searchVal, searchVal);
    }

    sql += " ORDER BY r.id DESC";

    db.query(sql, params, callback);
  },

  getById: (id, callback) => {
    db.query(
      `SELECT r.*, u.name as creator_name 
       FROM rfqs r 
       LEFT JOIN users u ON r.created_by = u.id 
       WHERE r.id = ?`,
      [id],
      (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);

        const rfq = results[0];

        // Fetch assigned vendors
        db.query(
          `SELECT v.* 
           FROM vendors v
           JOIN rfq_vendors rv ON v.id = rv.vendor_id
           WHERE rv.rfq_id = ?`,
          [id],
          (vendorErr, vendors) => {
            if (vendorErr) return callback(vendorErr);
            rfq.vendors = vendors;

            // Fetch submitted quotations
            db.query(
              `SELECT q.*, v.name as vendor_name 
               FROM quotations q
               JOIN vendors v ON q.vendor_id = v.id
               WHERE q.rfq_id = ?`,
              [id],
              (quoteErr, quotations) => {
                if (quoteErr) return callback(quoteErr);
                rfq.quotations = quotations;
                callback(null, rfq);
              }
            );
          }
        );
      }
    );
  },

  // Delete an RFQ by id
  delete: (id, callback) => {
    db.query("DELETE FROM rfqs WHERE id = ?", [id], callback);
  },

  // Update RFQ fields (title, description, quantity, deadline, status)
  update: (id, data, callback) => {
    const fields = [];
    const values = [];
    if (data.title) { fields.push("title = ?"); values.push(data.title); }
    if (data.description) { fields.push("description = ?"); values.push(data.description); }
    if (data.quantity) { fields.push("quantity = ?"); values.push(data.quantity); }
    if (data.deadline) { fields.push("deadline = ?"); values.push(data.deadline); }
    if (data.status) { fields.push("status = ?"); values.push(data.status); }
    if (fields.length === 0) return callback(null, { affectedRows: 0 });
    const sql = `UPDATE rfqs SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    db.query(sql, values, callback);
  },

  updateStatus: (id, status, callback) => {
    db.query("UPDATE rfqs SET status = ? WHERE id = ?", [status, id], callback);
  }
};

module.exports = RFQ;
