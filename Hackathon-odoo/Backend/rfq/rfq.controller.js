const RFQ = require("./rfq.model");
const Vendor = require("../vendor/vendor.model");
const activityService = require("../src/services/activity.service");
const notificationService = require("../src/services/notification.service");
const db = require("../src/config/db");

exports.createRFQ = (req, res) => {
  const { title, description, quantity, deadline, vendorIds } = req.body;

  if (!title || !quantity || !deadline) {
    return res.status(400).send("Title, quantity, and deadline are required");
  }

  const rfqData = {
    title,
    description,
    quantity,
    deadline,
    status: "Open",
    created_by: req.user.id,
    vendorIds
  };

  RFQ.create(rfqData, (err, rfq) => {
    if (err) {
      return res.status(500).send("Failed to create RFQ: " + err.message);
    }

    // Log Activity
    activityService.logActivity(
      req.user.id,
      "Create RFQ",
      `RFQ "${title}" (ID: ${rfq.id}) created`
    );

    // Send notifications to all assigned vendors
    if (vendorIds && vendorIds.length > 0) {
      vendorIds.forEach((vId) => {
        db.query("SELECT user_id FROM vendors WHERE id = ?", [vId], (err, results) => {
          if (!err && results && results.length > 0) {
            notificationService.createNotification(
              results[0].user_id,
              "New RFQ Invitation",
              `You have been invited to submit a quotation for RFQ: "${title}". Deadline is ${new Date(deadline).toLocaleString()}.`
            );
          }
        });
      });
    }

    res.status(201).json(rfq);
  });
};

exports.getAllRFQs = (req, res) => {
  const { status, search } = req.query;

  const handleFetch = (vendorId) => {
    RFQ.getAll({ vendorId, status, search }, (err, rfqs) => {
      if (err) {
        return res.status(500).send("Failed to retrieve RFQs: " + err.message);
      }
      res.json(rfqs);
    });
  };

  if (req.user.role === "vendor") {
    Vendor.getByUserId(req.user.id, (err, vendor) => {
      if (err || !vendor) {
        return res.status(404).send("Logged-in vendor record not found");
      }
      handleFetch(vendor.id);
    });
  } else {
    handleFetch(null);
  }
};

exports.getRFQById = (req, res) => {
  RFQ.getById(req.params.id, (err, rfq) => {
    if (err) {
      return res.status(500).send("Error fetching RFQ details: " + err.message);
    }
    if (!rfq) {
      return res.status(404).send("RFQ not found");
    }
    res.json(rfq);
  });
};

exports.updateRFQ = (req, res) => {
  const id = req.params.id;
  const updateData = req.body; // allowed fields: title, description, quantity, deadline, status

  RFQ.update(id, updateData, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to update RFQ: " + err.message);
    }
    // Log activity
    activityService.logActivity(
      req.user.id,
      "Update RFQ",
      `RFQ ID ${id} updated`
    );
    res.json({ message: "RFQ updated successfully", result });
  });
};

exports.deleteRFQ = (req, res) => {
  const id = req.params.id;
  RFQ.delete(id, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to delete RFQ: " + err.message);
    }
    // Log activity
    activityService.logActivity(
      req.user.id,
      "Delete RFQ",
      `RFQ ID ${id} deleted`
    );
    res.json({ message: "RFQ deleted successfully", result });
  });
};
exports.updateRFQStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) {
    return res.status(400).send('Status is required');
  }
  // Update only status field (others unchanged)
  RFQ.update(id, { status }, (err, result) => {
    if (err) {
      return res.status(500).send('Failed to update RFQ status: ' + err.message);
    }
    // Log activity
    activityService.logActivity(
      req.user.id,
      'Update RFQ Status',
      `RFQ ID ${id} status updated to ${status}`
    );
    res.json({ message: 'RFQ status updated successfully', result });
  });
};
