const Quotation = require("./quotation.model");
const Vendor = require("../vendor/vendor.model");
const activityService = require("../src/services/activity.service");
const notificationService = require("../src/services/notification.service");
const db = require("../src/config/db");

exports.submitQuotation = (req, res) => {
  const { rfq_id, pricing, delivery_timeline, notes } = req.body;

  if (!rfq_id || !pricing || !delivery_timeline) {
    return res.status(400).send("RFQ ID, pricing, and delivery timeline are required");
  }

  // Get the vendor record associated with the logged-in user
  Vendor.getByUserId(req.user.id, (err, vendor) => {
    if (err || !vendor) {
      return res.status(404).send("Logged-in vendor record not found. Only registered vendors can submit quotations.");
    }

    const quoteData = {
      rfq_id,
      vendor_id: vendor.id,
      pricing,
      delivery_timeline,
      notes
    };

    Quotation.createOrUpdate(quoteData, (err, result) => {
      if (err) {
        return res.status(500).send("Failed to submit quotation: " + err.message);
      }

      activityService.logActivity(
        req.user.id,
        result.updated ? "Update Quotation" : "Submit Quotation",
        `Quotation for RFQ ID ${rfq_id} submitted by vendor ${vendor.name} (pricing: ₹${pricing})`
      );

      // Notify procurement/admin users
      db.query("SELECT id FROM users WHERE role IN ('admin', 'procurement')", (uErr, users) => {
        if (!uErr && users) {
          users.forEach((u) => {
            notificationService.createNotification(
              u.id,
              "Quotation Received",
              `Vendor "${vendor.name}" submitted a quote of ₹${pricing} for RFQ ID ${rfq_id}`
            );
          });
        }
      });

      res.status(result.updated ? 200 : 201).json(result);
    });
  });
};

exports.getQuotationsByRfq = (req, res) => {
  const rfqId = req.params.rfqId;

  Quotation.getByRfqId(rfqId, (err, quotations) => {
    if (err) {
      return res.status(500).send("Failed to fetch quotations: " + err.message);
    }
    res.json(quotations);
  });
};

exports.getQuotationComparison = (req, res) => {
  const rfqId = req.params.rfqId;

  Quotation.getComparison(rfqId, (err, comparison) => {
    if (err) {
      return res.status(500).send("Failed to compare quotations: " + err.message);
    }
    res.json(comparison);
  });
};

exports.getQuotationById = (req, res) => {
  Quotation.getById(req.params.id, (err, quotation) => {
    if (err) {
      return res.status(500).send("Failed to fetch quotation details: " + err.message);
    }
    if (!quotation) {
      return res.status(404).send("Quotation not found");
    }
    res.json(quotation);
  });
};

exports.getAllQuotations = (req, res) => {
  const { status } = req.query;

  const handleFetch = (vendorId) => {
    Quotation.getAll({ vendorId, status }, (err, quotes) => {
      if (err) {
        return res.status(500).send("Failed to fetch quotations: " + err.message);
      }
      res.json(quotes);
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
