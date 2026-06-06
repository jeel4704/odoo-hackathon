const Invoice = require("./invoice.model");
const PurchaseOrder = require("../purchaseOrder/po.model");
const Vendor = require("../vendor/vendor.model");
const pdfService = require("../src/services/pdf.service");
const emailService = require("../src/services/email.service");
const activityService = require("../src/services/activity.service");
const notificationService = require("../src/services/notification.service");
const db = require("../src/config/db");
const fs = require("fs");

exports.createInvoice = (req, res) => {
  const { po_id } = req.body;

  if (!po_id) {
    return res.status(400).send("Purchase Order ID is required to generate an invoice");
  }

  // Ensure PO is accepted or completed
  db.query("SELECT status FROM purchase_orders WHERE id = ?", [po_id], (checkErr, checkRes) => {
    if (checkErr) return res.status(500).send(checkErr.message);
    if (checkRes.length === 0) return res.status(404).send("Purchase Order not found");
    
    // Create the invoice
    Invoice.create({ po_id }, (err, invoice) => {
      if (err) {
        return res.status(500).send("Failed to generate Invoice: " + err.message);
      }

      // Fetch complete details to generate PDF & email
      Invoice.getById(invoice.id, (detailErr, invoiceDetails) => {
        if (detailErr || !invoiceDetails) {
          console.error("Failed to load invoice details for PDF:", detailErr);
          return res.status(201).json(invoice); // respond with created invoice anyway
        }

        // Fetch purchase order details for pdf
        PurchaseOrder.getById(po_id, (poErr, poDetails) => {
          if (poErr || !poDetails) {
            console.error("Failed to load PO details for PDF:", poErr);
            return res.status(201).json(invoiceDetails);
          }

          // Generate PDF Invoice
          pdfService.generateInvoicePDF(invoiceDetails, poDetails, (pdfErr, pdfPath) => {
            if (pdfErr) {
              console.error("PDF generation failed:", pdfErr.message);
              return res.status(201).json(invoiceDetails);
            }

            // Save PDF path in database
            Invoice.updatePDFPath(invoiceDetails.id, pdfPath, (updatePathErr) => {
              if (updatePathErr) console.warn("Failed to store PDF path:", updatePathErr.message);

              // Email PDF to vendor asynchronously in background
              if (poDetails.vendor_email) {
                emailService.sendInvoiceEmail(poDetails.vendor_email, invoiceDetails.invoice_number, pdfPath)
                  .catch(e => console.error("Invoice background email dispatch failed:", e.message));
              }

              // Log Activity
              activityService.logActivity(
                req.user.id,
                "Generate Invoice",
                `Invoice ${invoiceDetails.invoice_number} generated for PO ${poDetails.po_number}`
              );

              // Notify the vendor
              notificationService.createNotification(
                poDetails.user_id,
                "Invoice Issued",
                `An invoice (${invoiceDetails.invoice_number}) has been generated for your Purchase Order ${poDetails.po_number}.`
              );

              res.status(201).json({ ...invoiceDetails, pdf_path: pdfPath });
            });
          });
        });
      });
    });
  });
};

exports.getAllInvoices = (req, res) => {
  const { status, search } = req.query;

  const handleFetch = (vendorId) => {
    Invoice.getAll({ vendorId, status, search }, (err, invoices) => {
      if (err) {
        return res.status(500).send("Failed to fetch invoices: " + err.message);
      }
      res.json(invoices);
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

exports.getInvoiceById = (req, res) => {
  Invoice.getById(req.params.id, (err, invoice) => {
    if (err) {
      return res.status(500).send("Error fetching invoice details: " + err.message);
    }
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }
    res.json(invoice);
  });
};

exports.downloadInvoicePDF = (req, res) => {
  Invoice.getById(req.params.id, (err, invoice) => {
    if (err || !invoice) {
      return res.status(404).send("Invoice not found");
    }
    if (!invoice.pdf_path || !fs.existsSync(invoice.pdf_path)) {
      return res.status(404).send("Invoice PDF file is missing or not yet generated");
    }
    res.download(invoice.pdf_path, `${invoice.invoice_number}.pdf`);
  });
};

exports.sendInvoiceEmailOnly = (req, res) => {
  Invoice.getById(req.params.id, (err, invoice) => {
    if (err || !invoice) {
      return res.status(404).send("Invoice not found");
    }
    if (!invoice.pdf_path || !fs.existsSync(invoice.pdf_path)) {
      return res.status(400).send("Invoice PDF does not exist on server. Please regenerate the invoice.");
    }

    emailService.sendInvoiceEmail(invoice.vendor_email, invoice.invoice_number, invoice.pdf_path)
      .then(() => {
        res.send("Invoice emailed successfully");
      })
      .catch((mailErr) => {
        res.status(500).send("Failed to email invoice: " + mailErr.message);
      });
  });
};

exports.updateInvoiceStatus = (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  if (!status) {
    return res.status(400).send("Status is required");
  }

  Invoice.updateStatus(id, status, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to update invoice status: " + err.message);
    }

    // Log Activity
    activityService.logActivity(
      req.user.id,
      "Update Invoice Status",
      `Invoice ID ${id} status set to ${status}`
    );

    res.send("Invoice status updated successfully");
  });
};
