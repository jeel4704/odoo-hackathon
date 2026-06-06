const db = require("../src/config/db");

const Invoice = {
  create: (data, callback) => {
    // 1. Generate sequential invoice number
    db.query("SELECT COUNT(*) as count FROM invoices", (countErr, countResults) => {
      if (countErr) return callback(countErr);

      const nextId = (countResults[0].count || 0) + 1;
      const year = new Date().getFullYear();
      const invoice_number = `INV-${year}-${String(nextId).padStart(4, "0")}`;

      // 2. Fetch the total amount from Purchase Order
      db.query("SELECT total_amount FROM purchase_orders WHERE id = ?", [data.po_id], (poErr, poResults) => {
        if (poErr) return callback(poErr);
        if (poResults.length === 0) return callback(new Error("Purchase Order not found"));

        const subtotal = poResults[0].total_amount;
        const gst_amount = subtotal * 0.18; // GST at 18%
        const total_amount = subtotal + gst_amount;

        // 3. Insert Invoice
        db.query(
          "INSERT INTO invoices (invoice_number, po_id, subtotal, gst_amount, total_amount, status) VALUES (?, ?, ?, ?, ?, 'Unpaid')",
          [invoice_number, data.po_id, subtotal, gst_amount, total_amount],
          (insertErr, result) => {
            if (insertErr) return callback(insertErr);
            callback(null, {
              id: result.insertId,
              invoice_number,
              subtotal,
              gst_amount,
              total_amount
            });
          }
        );
      });
    });
  },

  getAll: (filters, callback) => {
    let sql = `
      SELECT inv.*, po.po_number, v.name as vendor_name, r.title as rfq_title
      FROM invoices inv
      JOIN purchase_orders po ON inv.po_id = po.id
      JOIN vendors v ON po.vendor_id = v.id
      JOIN rfqs r ON po.rfq_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.vendorId) {
      sql += " AND po.vendor_id = ?";
      params.push(filters.vendorId);
    }

    if (filters.status) {
      sql += " AND inv.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      sql += " AND (inv.invoice_number LIKE ? OR po.po_number LIKE ? OR v.name LIKE ?)";
      const searchVal = `%${filters.search}%`;
      params.push(searchVal, searchVal, searchVal);
    }

    sql += " ORDER BY inv.id DESC";

    db.query(sql, params, callback);
  },

  getById: (id, callback) => {
    db.query(
      `SELECT inv.*, po.po_number, po.total_amount as po_amount,
              v.name as vendor_name, v.email as vendor_email, v.phone as vendor_phone, v.gst_number as vendor_gst, v.contact_person as vendor_contact,
              r.title as rfq_title, r.quantity as rfq_quantity, q.pricing as unit_pricing
       FROM invoices inv
       JOIN purchase_orders po ON inv.po_id = po.id
       JOIN vendors v ON po.vendor_id = v.id
       JOIN rfqs r ON po.rfq_id = r.id
       JOIN quotations q ON po.quotation_id = q.id
       WHERE inv.id = ?`,
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      }
    );
  },

  updatePDFPath: (id, pdfPath, callback) => {
    db.query("UPDATE invoices SET pdf_path = ? WHERE id = ?", [pdfPath, id], callback);
  },

  updateStatus: (id, status, callback) => {
    db.query("UPDATE invoices SET status = ? WHERE id = ?", [status, id], callback);
  }
};

module.exports = Invoice;
