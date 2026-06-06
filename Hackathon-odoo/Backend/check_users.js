const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2");

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
  
  db.query("SELECT * FROM users", (err, users) => {
    if (err) {
      console.error("Error querying users:", err);
      process.exit(1);
    }
    console.log("USERS IN DB:", users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, verified: u.verified })));
    
    db.query("SELECT * FROM vendors", (err, vendors) => {
      if (err) {
        console.error("Error querying vendors:", err);
        process.exit(1);
      }
      console.log("VENDORS IN DB:", vendors.map(v => ({ id: v.id, user_id: v.user_id, name: v.name, email: v.email })));
      process.exit(0);
    });
  });
});
