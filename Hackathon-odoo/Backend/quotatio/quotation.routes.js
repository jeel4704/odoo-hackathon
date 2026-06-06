const router = require("express").Router();
const controller = require("./quotation.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

router.post("/", auth, role(["vendor"]), controller.submitQuotation);
router.get("/", auth, controller.getAllQuotations);
router.get("/rfq/:rfqId", auth, role(["admin", "procurement", "manager"]), controller.getQuotationsByRfq);
router.get("/rfq/:rfqId/compare", auth, role(["admin", "procurement", "manager"]), controller.getQuotationComparison);
router.get("/:id", auth, controller.getQuotationById);

module.exports = router;
