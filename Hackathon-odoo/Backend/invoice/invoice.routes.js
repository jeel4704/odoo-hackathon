const router = require("express").Router();
const controller = require("./invoice.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

router.post("/", auth, role(["admin", "procurement", "vendor"]), controller.createInvoice);
router.get("/", auth, controller.getAllInvoices);
router.get("/:id", auth, controller.getInvoiceById);
router.get("/:id/download", auth, controller.downloadInvoicePDF);
router.post("/:id/email", auth, role(["admin", "procurement", "manager"]), controller.sendInvoiceEmailOnly);
router.put("/:id/status", auth, role(["admin", "procurement", "manager"]), controller.updateInvoiceStatus);

module.exports = router;
