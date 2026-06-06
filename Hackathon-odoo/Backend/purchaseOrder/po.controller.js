const PurchaseOrder = require("./po.model");
const Vendor = require("../vendor/vendor.model");
const activityService = require("../src/services/activity.service");
const notificationService = require("../src/services/notification.service");
const db = require("../src/config/db");

exports.createPurchaseOrder = (req, res) => {
  const { quotation_id } = req.body;

  if (!quotation_id) {
    return res.status(400).send("Quotation ID is required to generate a Purchase Order");
  }

  // Double check if quotation is approved
  db.query("SELECT status FROM quotations WHERE id = ?", [quotation_id], (checkErr, checkRes) => {
    if (checkErr) return res.status(500).send(checkErr.message);
    if (checkRes.length === 0) return res.status(404).send("Quotation not found");
    if (checkRes[0].status !== "Approved") {
      return res.status(400).send("Purchase Order can only be generated from approved quotations");
    }

    PurchaseOrder.create({ quotation_id }, (err, po) => {
      if (err) {
        return res.status(500).send("Failed to generate Purchase Order: " + err.message);
      }

      // Log Activity
      activityService.logActivity(
        req.user.id,
        "Generate Purchase Order",
        `Purchase Order ${po.po_number} (ID: ${po.id}) generated from Quotation ID ${quotation_id}`
      );

      // Notify the vendor
      db.query("SELECT user_id FROM vendors WHERE id = (SELECT vendor_id FROM purchase_orders WHERE id = ?)", [po.id], (vErr, results) => {
        if (!vErr && results && results.length > 0) {
          notificationService.createNotification(
            results[0].user_id,
            "Purchase Order Received",
            `A new Purchase Order ${po.po_number} totaling ₹${po.total_amount} has been generated and sent to you.`
          );
        }
      });

      res.status(201).json(po);
    });
  });
};

exports.getAllPurchaseOrders = (req, res) => {
  const { status, search } = req.query;

  const handleFetch = (vendorId) => {
    PurchaseOrder.getAll({ vendorId, status, search }, (err, pos) => {
      if (err) {
        return res.status(500).send("Failed to fetch Purchase Orders: " + err.message);
      }
      res.json(pos);
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

exports.getPurchaseOrderById = (req, res) => {
  PurchaseOrder.getById(req.params.id, (err, po) => {
    if (err) {
      return res.status(500).send("Error fetching Purchase Order: " + err.message);
    }
    if (!po) {
      return res.status(404).send("Purchase Order not found");
    }
    res.json(po);
  });
};

exports.updatePOStatus = (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  if (!status) {
    return res.status(400).send("Status is required");
  }

  PurchaseOrder.updateStatus(id, status, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to update PO status: " + err.message);
    }

    // Log Activity
    activityService.logActivity(
      req.user.id,
      "Update PO Status",
      `Purchase Order ID ${id} status updated to ${status}`
    );

    // Notify procurement/admin
    db.query("SELECT id FROM users WHERE role IN ('admin', 'procurement')", (uErr, users) => {
      if (!uErr && users) {
        users.forEach((u) => {
          notificationService.createNotification(
            u.id,
            "PO Status Updated",
            `Purchase Order ID ${id} status has been updated to "${status}" by the vendor.`
          );
        });
      }
    });

    res.send("Purchase Order status updated successfully");
  });
};
