const router = require("express").Router();
const controller = require("./rfq.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

router.post("/", auth, role(["admin", "procurement", "manager"]), controller.createRFQ);
router.get("/", auth, controller.getAllRFQs);
router.get("/:id", auth, controller.getRFQById);
router.delete("/:id", auth, role(["admin", "procurement", "manager"]), controller.deleteRFQ);
router.put("/:id", auth, role(["admin", "procurement", "manager"]), controller.updateRFQ);
router.put("/:id/status", auth, role(["admin", "procurement", "manager"]), controller.updateRFQStatus);

module.exports = router;
