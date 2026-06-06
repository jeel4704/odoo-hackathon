const router = require("express").Router();
const auth = require("../middlewere/auth.middleware");
const db = require("../config/db");

// Get all notifications for user
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    }
  );
});

// Mark notification as read
router.put("/:id/read", auth, (req, res) => {
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.send("Notification marked as read");
    }
  );
});

module.exports = router;
