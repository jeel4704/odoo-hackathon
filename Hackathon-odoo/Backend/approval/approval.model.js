const db = require("../src/config/db");

const Approval = {
  create: (data, callback) => {
    // Start transaction sequence
    db.query(
      "INSERT INTO approvals (quotation_id, manager_id, status, remarks) VALUES (?, ?, ?, ?)",
      [data.quotation_id, data.manager_id, data.status, data.remarks],
      (err, result) => {
        if (err) return callback(err);

        // Update the quotation status
        db.query(
          "UPDATE quotations SET status = ? WHERE id = ?",
          [data.status, data.quotation_id],
          (quoteErr) => {
            if (quoteErr) return callback(quoteErr);

            if (data.status === "Approved") {
              // If approved, reject all other quotations for the same RFQ, and update RFQ status to 'Completed'
              db.query(
                "SELECT rfq_id FROM quotations WHERE id = ?",
                [data.quotation_id],
                (rfqErr, rfqResults) => {
                  if (rfqErr || rfqResults.length === 0) return callback(rfqErr);
                  const rfqId = rfqResults[0].rfq_id;

                  // Reject other quotations
                  db.query(
                    "UPDATE quotations SET status = 'Rejected' WHERE rfq_id = ? AND id != ?",
                    [rfqId, data.quotation_id],
                    (rejectErr) => {
                      if (rejectErr) return callback(rejectErr);

                      // Complete RFQ
                      db.query(
                        "UPDATE rfqs SET status = 'Completed' WHERE id = ?",
                        [rfqId],
                        (rfqUpdateErr) => {
                          if (rfqUpdateErr) return callback(rfqUpdateErr);
                          callback(null, result);
                        }
                      );
                    }
                  );
                }
              );
            } else {
              callback(null, result);
            }
          }
        );
      }
    );
  },

  getHistoryByQuotation: (quotationId, callback) => {
    db.query(
      `SELECT a.*, u.name as manager_name 
       FROM approvals a
       JOIN users u ON a.manager_id = u.id
       WHERE a.quotation_id = ?
       ORDER BY a.id DESC`,
      [quotationId],
      callback
    );
  },

  getAllPendingApprovals: (callback) => {
    // Fetch all quotations that are currently submitted/under review
    db.query(
      `SELECT q.*, v.name as vendor_name, r.title as rfq_title 
       FROM quotations q
       JOIN vendors v ON q.vendor_id = v.id
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.status = 'Submitted'`,
      [],
      callback
    );
  }
};

module.exports = Approval;
