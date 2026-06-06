const db = require("../config/db");

exports.logActivity = (userId, action, details) => {
  db.query(
    "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)",
    [userId || null, action, details || ""],
    (err) => {
      if (err) {
        console.error("Failed to log activity:", err.message);
      }
    }
  );
};
