const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const vendorRoutes = require("../vendor/vendor.routes");
const rfqRoutes = require("../rfq/rfq.routes");
const quotationRoutes = require("../quotatio/quotation.routes");
const approvalRoutes = require("../approval/approval.routes");
const poRoutes = require("../purchaseOrder/po.routes");
const invoiceRoutes = require("../invoice/invoice.routes");
const notificationRoutes = require("./routes/notification.routes");
const activityRoutes = require("./routes/activity.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes Mappings
app.use("/api", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/pos", poRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
