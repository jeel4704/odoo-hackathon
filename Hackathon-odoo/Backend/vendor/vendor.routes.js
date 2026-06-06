const router = require("express").Router();
const controller = require("./vendor.controller");
const auth = require("../src/middlewere/auth.middleware");
const role = require("../src/middlewere/role.middleware");

// Vendor profile route (needs to be above /:id)
router.get("/profile", auth, role(["vendor"]), controller.getVendorProfile);

// Core CRUD routes
router.post("/", auth, role(["admin", "procurement"]), controller.createVendor);
router.get("/", auth, role(["admin", "procurement", "manager"]), controller.getAllVendors);
router.get("/:id", auth, role(["admin", "procurement", "manager"]), controller.getVendorById);
router.put("/:id", auth, role(["admin", "procurement"]), controller.updateVendor);
router.delete("/:id", auth, role(["admin"]), controller.deleteVendor);

module.exports = router;
