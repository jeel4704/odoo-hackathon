const router = require("express").Router();
const auth = require("../middlewere/auth.middleware");
const role = require("../middlewere/role.middleware");
const db = require("../config/db");

// Get all activity logs
router.get("/", auth, role(["admin", "procurement", "manager"]), (req, res) => {
  db.query(
    `SELECT al.*, u.name as user_name, u.role as user_role 
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.id DESC LIMIT 100`,
    [],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    }
  );
});

module.exports = router;
