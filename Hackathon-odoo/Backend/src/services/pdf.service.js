const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoicePDF = (invoice, po, callback) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    
    // Ensure invoices folder exists inside the backend directory
    const dir = path.join(__dirname, "../../../invoices");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `invoice-${invoice.invoice_number}.pdf`;
    const filePath = path.join(dir, filename);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Header styling
    doc
      .fillColor("#059669")
      .fontSize(22)
      .text("VendorBridge ERP", 50, 45)
      .fontSize(10)
      .fillColor("#64748b")
      .text("Secure procurement platform", 50, 70)
      .fillColor("#1e293b")
      .fontSize(18)
      .text("INVOICE", 400, 45, { align: "right" })
      .fontSize(9)
      .text(`Invoice No: ${invoice.invoice_number}`, 400, 70, { align: "right" })
      .text(`Date: ${new Date(invoice.created_at || Date.now()).toLocaleDateString()}`, 400, 85, { align: "right" })
      .text(`PO Ref: ${po.po_number}`, 400, 100, { align: "right" });

    // Draw horizontal line
    doc
      .strokeColor("#cbd5e1")
      .lineWidth(1)
      .moveTo(50, 125)
      .lineTo(550, 125)
      .stroke();

    // Bill Details
    doc
      .fillColor("#0f172a")
      .fontSize(11)
      .text("Billed To (Buyer):", 50, 145, { underline: true })
      .fontSize(9)
      .fillColor("#334155")
      .text("VendorBridge Procurement", 50, 160)
      .text("Odoo Hackathon Headquarters", 50, 175)
      .text("Email: operations@vendorbridge.com", 50, 190);

    doc
      .fillColor("#0f172a")
      .fontSize(11)
      .text("Vendor (Seller):", 300, 145, { underline: true })
      .fontSize(9)
      .fillColor("#334155")
      .text(po.vendor_name || "N/A", 300, 160)
      .text(`GST: ${po.vendor_gst || "N/A"}`, 300, 175)
      .text(`Contact: ${po.vendor_contact || "N/A"}`, 300, 190)
      .text(`Email: ${po.vendor_email || "N/A"}`, 300, 205);

    // Table Header
    doc
      .strokeColor("#cbd5e1")
      .lineWidth(1)
      .moveTo(50, 240)
      .lineTo(550, 240)
      .stroke();

    doc
      .fillColor("#0f172a")
      .fontSize(10)
      .text("Item / Description", 55, 248)
      .text("Qty", 280, 248, { align: "center" })
      .text("Unit Price (₹)", 370, 248, { align: "right" })
      .text("Total (₹)", 480, 248, { align: "right" });

    doc
      .strokeColor("#94a3b8")
      .lineWidth(1)
      .moveTo(50, 265)
      .lineTo(550, 265)
      .stroke();

    // Table Row
    doc
      .fillColor("#334155")
      .fontSize(9)
      .text(po.rfq_title || "Procurement Service/Good", 55, 280, { width: 200 })
      .text(String(po.rfq_quantity || 1), 280, 280, { align: "center" })
      .text(Number(po.unit_pricing || po.total_amount).toFixed(2), 370, 280, { align: "right" })
      .text(Number(invoice.subtotal).toFixed(2), 480, 280, { align: "right" });

    // Table Footer Lines
    doc
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .moveTo(50, 310)
      .lineTo(550, 310)
      .stroke();

    // Calculations Box
    const startX = 350;
    const startY = 330;
    doc
      .fillColor("#0f172a")
      .text("Subtotal:", startX, startY)
      .text(`₹${Number(invoice.subtotal).toFixed(2)}`, 480, startY, { align: "right" })
      
      .text("GST (18%):", startX, startY + 20)
      .text(`₹${Number(invoice.gst_amount).toFixed(2)}`, 480, startY + 20, { align: "right" });

    doc
      .strokeColor("#059669")
      .lineWidth(1.5)
      .moveTo(startX, startY + 40)
      .lineTo(550, startY + 40)
      .stroke();

    doc
      .fillColor("#059669")
      .fontSize(11)
      .text("Grand Total:", startX, startY + 50)
      .text(`₹${Number(invoice.total_amount).toFixed(2)}`, 480, startY + 50, { align: "right" });

    // Signature Area
    doc
      .fillColor("#64748b")
      .fontSize(8)
      .text("Authorized Signature", 50, startY + 120, { underline: true })
      .text("Thank you for your business!", 50, startY + 155, { align: "center" });

    doc.end();

    writeStream.on("finish", () => {
      callback(null, filePath);
    });

    writeStream.on("error", (err) => {
      callback(err);
    });
  } catch (err) {
    callback(err);
  }
};
