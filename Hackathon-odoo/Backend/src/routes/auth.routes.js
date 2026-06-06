const router = require("express").Router();
const auth = require("../controllers/auth.controllr"); // Spelled auth.controllr to match file system

router.post("/register", auth.register);
router.post("/register-verify", auth.registerVerify);
router.post("/login", auth.login);
router.post("/auth/google-login", auth.googleLogin);

module.exports = router;