const Approval = require("./approval.model");
const activityService = require("../src/services/activity.service");
const notificationService = require("../src/services/notification.service");
const db = require("../src/config/db");

exports.submitApproval = (req, res) => {
  const { quotation_id, status, remarks } = req.body;

  if (!quotation_id || !status) {
    return res.status(400).send("Quotation ID and status (Approved/Rejected) are required");
  }

  const approvalData = {
    quotation_id,
    manager_id: req.user.id,
    status,
    remarks
  };

  Approval.create(approvalData, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to record approval: " + err.message);
    }

    // Log Activity
    activityService.logActivity(
      req.user.id,
      "Quotation Review",
      `Quotation ID ${quotation_id} was ${status} with remarks: "${remarks || ""}"`
    );

    // Notify the vendor
    db.query(
      `SELECT v.user_id, v.name, q.rfq_id, r.title as rfq_title 
       FROM quotations q 
       JOIN vendors v ON q.vendor_id = v.id 
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.id = ?`,
      [quotation_id],
      (vErr, results) => {
        if (!vErr && results && results.length > 0) {
          const v = results[0];
          notificationService.createNotification(
            v.user_id,
            `Quotation ${status}`,
            `Your quotation for RFQ "${v.rfq_title}" has been ${status.toLowerCase()} by the manager. Remarks: ${remarks || "None"}`
          );
        }
      }
    );

    res.status(201).send(`Quotation review recorded as ${status}`);
  });
};

exports.getPendingApprovals = (req, res) => {
  Approval.getAllPendingApprovals((err, pending) => {
    if (err) {
      return res.status(500).send("Failed to retrieve pending approvals: " + err.message);
    }
    res.json(pending);
  });
};

exports.getApprovalHistory = (req, res) => {
  const quotationId = req.params.quotationId;

  Approval.getHistoryByQuotation(quotationId, (err, history) => {
    if (err) {
      return res.status(500).send("Failed to retrieve approval history: " + err.message);
    }
    res.json(history);
  });
};
