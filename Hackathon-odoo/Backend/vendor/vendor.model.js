const db = require("../src/config/db");
const bcrypt = require("bcrypt");

const Vendor = {
  create: (data, callback) => {
    // 1. Create a user account for the vendor automatically
    const tempPassword = data.password || "Vendor@123";
    const hash = bcrypt.hashSync(tempPassword, 10);
    
    db.query(
      "INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, 'vendor', 1)",
      [data.name, data.email, hash],
      (err, userResult) => {
        if (err) return callback(err);

        const userId = userResult.insertId;

        // 2. Insert vendor details linked to the new user ID
        db.query(
          "INSERT INTO vendors (user_id, name, category, gst_number, contact_person, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            userId,
            data.name,
            data.category,
            data.gst_number,
            data.contact_person,
            data.email,
            data.phone,
            data.status || "Active"
          ],
          (err, vendorResult) => {
            if (err) {
              // Rollback user creation
              db.query("DELETE FROM users WHERE id = ?", [userId]);
              return callback(err);
            }
            callback(null, { id: vendorResult.insertId, userId, ...data });
          }
        );
      }
    );
  },

  getAll: (filters, callback) => {
    let sql = "SELECT * FROM vendors WHERE 1=1";
    const params = [];

    if (filters.search) {
      sql += " AND (name LIKE ? OR contact_person LIKE ? OR email LIKE ?)";
      const searchVal = `%${filters.search}%`;
      params.push(searchVal, searchVal, searchVal);
    }

    if (filters.category) {
      sql += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.status) {
      sql += " AND status = ?";
      params.push(filters.status);
    }

    sql += " ORDER BY id DESC";

    db.query(sql, params, callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM vendors WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  getByUserId: (userId, callback) => {
    db.query("SELECT * FROM vendors WHERE user_id = ?", [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  update: (id, data, callback) => {
    db.query(
      "UPDATE vendors SET name = ?, category = ?, gst_number = ?, contact_person = ?, email = ?, phone = ?, status = ? WHERE id = ?",
      [
        data.name,
        data.category,
        data.gst_number,
        data.contact_person,
        data.email,
        data.phone,
        data.status,
        id
      ],
      (err, result) => {
        if (err) return callback(err);
        
        // Also update vendor user name & email in users table
        db.query(
          "UPDATE users u JOIN vendors v ON u.id = v.user_id SET u.name = ?, u.email = ? WHERE v.id = ?",
          [data.name, data.email, id],
          (userErr) => {
            if (userErr) console.warn("Failed to sync user table update for vendor:", userErr.message);
            callback(null, result);
          }
        );
      }
    );
  },

  delete: (id, callback) => {
    // Get vendor's user_id first so we can clean up both tables
    db.query("SELECT user_id FROM vendors WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error("Vendor not found"));

      const userId = results[0].user_id;

      db.query("DELETE FROM vendors WHERE id = ?", [id], (err, result) => {
        if (err) return callback(err);

        if (userId) {
          db.query("DELETE FROM users WHERE id = ?", [userId], (userErr) => {
            if (userErr) console.warn("Failed to delete user account for vendor:", userErr.message);
            callback(null, result);
          });
        } else {
          callback(null, result);
        }
      });
    });
  }
};

module.exports = Vendor;
