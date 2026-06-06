const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Neer@7035",
  database: process.env.DB_NAME || "vendorbridge"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  }
  
  db.query("SELECT * FROM users WHERE email = 'admin@vendorbridge.com'", (err, results) => {
    if (err) {
      console.error("Error querying admin:", err);
      process.exit(1);
    }
    if (results.length === 0) {
      console.log("Admin user does not exist in database!");
    } else {
      const user = results[0];
      const match = bcrypt.compareSync("Admin@123", user.password);
      console.log("Admin user found:", { id: user.id, name: user.name, email: user.email, verified: user.verified });
      console.log("Does 'Admin@123' match the hash?", match);
    }
    process.exit(0);
  });
});
