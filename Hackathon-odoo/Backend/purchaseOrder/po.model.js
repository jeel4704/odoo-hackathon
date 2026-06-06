const db = require("../src/config/db");

const PurchaseOrder = {
  create: (data, callback) => {
    // 1. Generate sequential PO number
    db.query("SELECT COUNT(*) as count FROM purchase_orders", (countErr, countResults) => {
      if (countErr) return callback(countErr);
      
      const nextId = (countResults[0].count || 0) + 1;
      const year = new Date().getFullYear();
      const po_number = `PO-${year}-${String(nextId).padStart(4, "0")}`;

      // 2. Fetch details from the approved quotation to populate amounts
      db.query(
        "SELECT q.pricing, q.vendor_id, q.rfq_id, r.quantity FROM quotations q JOIN rfqs r ON q.rfq_id = r.id WHERE q.id = ?",
        [data.quotation_id],
        (quoteErr, quoteResults) => {
          if (quoteErr) return callback(quoteErr);
          if (quoteResults.length === 0) return callback(new Error("Quotation not found"));

          const q = quoteResults[0];
          const total_amount = q.pricing * q.quantity;

          // 3. Insert Purchase Order record
          db.query(
            "INSERT INTO purchase_orders (po_number, quotation_id, vendor_id, rfq_id, total_amount, status) VALUES (?, ?, ?, ?, ?, 'Sent')",
            [po_number, data.quotation_id, q.vendor_id, q.rfq_id, total_amount],
            (insertErr, result) => {
              if (insertErr) return callback(insertErr);
              
              // Update quotation status to 'Ordered' to prevent duplicate PO creation
              db.query(
                "UPDATE quotations SET status = 'Ordered' WHERE id = ?",
                [data.quotation_id],
                (uErr) => {
                  if (uErr) console.warn("Failed to update quotation status to Ordered:", uErr.message);
                  callback(null, { id: result.insertId, po_number, total_amount });
                }
              );
            }
          );
        }
      );
    });
  },

  getAll: (filters, callback) => {
    let sql = `
      SELECT po.*, v.name as vendor_name, r.title as rfq_title, r.quantity as rfq_quantity, q.pricing as unit_pricing
      FROM purchase_orders po
      JOIN vendors v ON po.vendor_id = v.id
      JOIN rfqs r ON po.rfq_id = r.id
      JOIN quotations q ON po.quotation_id = q.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.vendorId) {
      sql += " AND po.vendor_id = ?";
      params.push(filters.vendorId);
    }

    if (filters.status) {
      sql += " AND po.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      sql += " AND (po.po_number LIKE ? OR r.title LIKE ? OR v.name LIKE ?)";
      const searchVal = `%${filters.search}%`;
      params.push(searchVal, searchVal, searchVal);
    }

    sql += " ORDER BY po.id DESC";

    db.query(sql, params, callback);
  },

  getById: (id, callback) => {
    db.query(
      `SELECT po.*, v.name as vendor_name, v.email as vendor_email, v.phone as vendor_phone, v.gst_number as vendor_gst, v.contact_person as vendor_contact,
              r.title as rfq_title, r.description as rfq_desc, r.quantity as rfq_quantity, q.pricing as unit_pricing, q.notes as quotation_notes
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       JOIN rfqs r ON po.rfq_id = r.id
       JOIN quotations q ON po.quotation_id = q.id
       WHERE po.id = ?`,
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      }
    );
  },

  updateStatus: (id, status, callback) => {
    db.query("UPDATE purchase_orders SET status = ? WHERE id = ?", [status, id], callback);
  }
};

module.exports = PurchaseOrder;
