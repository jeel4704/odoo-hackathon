const router = require("express").Router();
const controller = require("./approval.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

router.post("/", auth, role(["admin", "manager"]), controller.submitApproval);
router.get("/pending", auth, role(["admin", "manager", "procurement"]), controller.getPendingApprovals);
router.get("/history/:quotationId", auth, controller.getApprovalHistory);

module.exports = router;
