const db = require("../config/db");

exports.createNotification = (userId, title, message) => {
  db.query(
    "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
    [userId, title, message],
    (err) => {
      if (err) {
        console.error("Failed to save notification:", err.message);
      }
    }
  );
};
