const router = require("express").Router();
const controller = require("./po.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

router.post("/", auth, role(["admin", "procurement"]), controller.createPurchaseOrder);
router.get("/", auth, controller.getAllPurchaseOrders);
router.get("/:id", auth, controller.getPurchaseOrderById);
router.put("/:id/status", auth, role(["admin", "procurement", "vendor"]), controller.updatePOStatus);

module.exports = router;
