const db = require("../src/config/db");

const Quotation = {
  createOrUpdate: (data, callback) => {
    // Check if quotation already exists for this RFQ and vendor
    db.query(
      "SELECT id FROM quotations WHERE rfq_id = ? AND vendor_id = ?",
      [data.rfq_id, data.vendor_id],
      (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
          // Update existing quotation (editable quotations feature)
          const quoteId = results[0].id;
          db.query(
            "UPDATE quotations SET pricing = ?, delivery_timeline = ?, notes = ?, status = 'Submitted', submitted_at = CURRENT_TIMESTAMP WHERE id = ?",
            [data.pricing, data.delivery_timeline, data.notes, quoteId],
            (updateErr) => {
              if (updateErr) return callback(updateErr);
              callback(null, { id: quoteId, ...data, updated: true });
            }
          );
        } else {
          // Insert new quotation
          db.query(
            "INSERT INTO quotations (rfq_id, vendor_id, pricing, delivery_timeline, notes, status) VALUES (?, ?, ?, ?, ?, 'Submitted')",
            [data.rfq_id, data.vendor_id, data.pricing, data.delivery_timeline, data.notes],
            (insertErr, result) => {
              if (insertErr) return callback(insertErr);
              callback(null, { id: result.insertId, ...data, updated: false });
            }
          );
        }
      }
    );
  },

  getById: (id, callback) => {
    db.query(
      `SELECT q.*, v.name as vendor_name, v.email as vendor_email, r.title as rfq_title 
       FROM quotations q
       JOIN vendors v ON q.vendor_id = v.id
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.id = ?`,
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      }
    );
  },

  getByRfqId: (rfqId, callback) => {
    db.query(
      `SELECT q.*, v.name as vendor_name, v.category as vendor_category, v.contact_person as vendor_contact 
       FROM quotations q
       JOIN vendors v ON q.vendor_id = v.id
       WHERE q.rfq_id = ?
       ORDER BY q.pricing ASC`,
      [rfqId],
      callback
    );
  },

  getComparison: (rfqId, callback) => {
    // Side by side comparison query, sorted by pricing ASC (lowest first)
    db.query(
      `SELECT q.*, v.name as vendor_name, v.category as vendor_category, v.gst_number, v.phone as vendor_phone, r.title as rfq_title, r.quantity as rfq_quantity
       FROM quotations q
       JOIN vendors v ON q.vendor_id = v.id
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.rfq_id = ?
       ORDER BY q.pricing ASC`,
      [rfqId],
      callback
    );
  },

  updateStatus: (id, status, callback) => {
    db.query("UPDATE quotations SET status = ? WHERE id = ?", [status, id], callback);
  },

  getAll: (filters, callback) => {
    let sql = `
      SELECT q.*, v.name as vendor_name, v.category as vendor_category, r.title as rfq_title 
      FROM quotations q
      JOIN vendors v ON q.vendor_id = v.id
      JOIN rfqs r ON q.rfq_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.vendorId) {
      sql += " AND q.vendor_id = ?";
      params.push(filters.vendorId);
    }

    if (filters.status) {
      sql += " AND q.status = ?";
      params.push(filters.status);
    }

    sql += " ORDER BY q.id DESC";

    db.query(sql, params, callback);
  }
};

module.exports = Quotation;
