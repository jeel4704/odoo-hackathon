const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Neer@7035",
  database: process.env.DB_NAME || "vendorbridge"
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("MySQL Connected");
    initializeDatabaseSchema();
  }
});

function initializeDatabaseSchema() {
  const tables = [
    {
      name: "users",
      query: `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        verified TINYINT(1) DEFAULT 0,
        otp VARCHAR(6) NULL,
        otp_expires_at DATETIME NULL
      )`
    },
    {
      name: "vendors",
      query: `CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        gst_number VARCHAR(50) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`
    },
    {
      name: "rfqs",
      query: `CREATE TABLE IF NOT EXISTS rfqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INT DEFAULT 1,
        deadline DATETIME NOT NULL,
        status VARCHAR(50) DEFAULT 'Open',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )`
    },
    {
      name: "rfq_vendors",
      query: `CREATE TABLE IF NOT EXISTS rfq_vendors (
        rfq_id INT,
        vendor_id INT,
        PRIMARY KEY(rfq_id, vendor_id),
        FOREIGN KEY (rfq_id) REFERENCES rfqs(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
      )`
    },
    {
      name: "quotations",
      query: `CREATE TABLE IF NOT EXISTS quotations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rfq_id INT,
        vendor_id INT,
        pricing DECIMAL(10,2) NOT NULL,
        delivery_timeline INT NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Submitted',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rfq_id) REFERENCES rfqs(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
      )`
    },
    {
      name: "approvals",
      query: `CREATE TABLE IF NOT EXISTS approvals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quotation_id INT,
        manager_id INT,
        status VARCHAR(50) NOT NULL,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
      )`
    },
    {
      name: "purchase_orders",
      query: `CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        quotation_id INT,
        vendor_id INT,
        rfq_id INT,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        FOREIGN KEY (rfq_id) REFERENCES rfqs(id) ON DELETE CASCADE
      )`
    },
    {
      name: "invoices",
      query: `CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        po_id INT,
        subtotal DECIMAL(10,2) NOT NULL,
        gst_amount DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Unpaid',
        pdf_path VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
      )`
    },
    {
      name: "notifications",
      query: `CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    },
    {
      name: "activity_logs",
      query: `CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`
    }
  ];

  const executeTableCreation = (index) => {
    if (index >= tables.length) {
      console.log("Database schema initialized successfully.");
      seedDefaultAdmin();
      return;
    }

    const table = tables[index];
    db.query(table.query, (err) => {
      if (err) {
        console.error(`Failed to ensure table '${table.name}' exists:`, err.message);
      } else {
        console.log(`Verified table structural integrity: ${table.name}`);
      }
      executeTableCreation(index + 1);
    });
  };

  executeTableCreation(0);
}

function seedDefaultAdmin() {
  const adminEmail = "admin@vendorbridge.com";
  db.query("SELECT * FROM users WHERE email = ?", [adminEmail], (err, results) => {
    if (err) {
      console.error("Failed to check for seed admin:", err.message);
      return;
    }

    if (results.length === 0) {
      const bcrypt = require("bcrypt");
      const hash = bcrypt.hashSync("Admin@123", 10);
      db.query(
        "INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, 1)",
        ["System Admin", adminEmail, hash, "admin"],
        (insertErr) => {
          if (insertErr) {
            console.error("Failed to seed default admin user:", insertErr.message);
          } else {
            console.log(`Successfully seeded default admin user (${adminEmail} / Admin@123)`);
          }
        }
      );
    } else {
      console.log("Seed admin user check: OK");
    }
  });
}

module.exports = db;