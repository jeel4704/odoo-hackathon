const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const emailService = require("../services/email.service");

// Helper to generate a 6-digit numeric OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.register = (req, res) => {
  // Extract fields from request body
  const { name, email, password, role } = req.body;

  // Trim/normalise input fields
  const cleanEmail = email?.trim().toLowerCase();
  const cleanName = name?.trim();
  if (!cleanName) return res.status(400).send("Name is required");
  if (!cleanEmail) return res.status(400).send("Email is required");
  if (!password) return res.status(400).send("Password is required");
  if (!role) return res.status(400).send("Role is required");


  // Allowed roles
  const allowedRoles = ["admin", "procurement", "vendor", "manager"]; // system admin
  if (!allowedRoles.includes(role)) {
    return res.status(400).send("Invalid role specified");
  }

  // Proceed with DB check
  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], (err, results) => {
    if (err) { console.error('DB error during registration:', err); return res.status(500).send(err); }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hash = bcrypt.hashSync(password, 10);

    if (results.length > 0) {
      const user = results[0];
      if (user.verified) {
        return res.status(400).send("Email already registered and verified");
      }
      // Update existing unverified user
      db.query(
        "UPDATE users SET name = ?, password = ?, role = ?, otp = ?, otp_expires_at = ? WHERE email = ?",
        [cleanName, hash, role, otp, otpExpires, cleanEmail],
        (err) => {
          if (err) { console.error('DB update error during registration:', err); return res.status(500).send(err); }
          emailService.sendOTPEmail(cleanEmail, otp).catch((e) => {
            console.error("Failed to send OTP email in background:", e.message);
          });
          res.json({ otpSent: true, email: cleanEmail });
        }
      );
    } else {
      // Insert new user
      db.query(
        "INSERT INTO users (name, email, password, role, verified, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [cleanName, cleanEmail, hash, role, 0, otp, otpExpires],
        (err) => {
          if (err) { console.error('DB insert error during registration:', err); return res.status(500).send(err); }
          emailService.sendOTPEmail(cleanEmail, otp).catch((e) => {
            console.error("Failed to send OTP email in background:", e.message);
          });
          res.json({ otpSent: true, email: cleanEmail });
        }
      );
    }
  });
};

exports.registerVerify = (req, res) => {
  const { email, otp } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("User not found");

    const user = results[0];

    if (user.verified) {
      return res.status(400).send("User email is already verified");
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).send("Invalid verification code");
    }

    const expireTime = new Date(user.otp_expires_at).getTime();
    if (Date.now() > expireTime) {
      return res.status(400).send("Verification code has expired");
    }

    // Verify user and remove OTP details
    db.query(
      "UPDATE users SET verified = 1, otp = NULL, otp_expires_at = NULL WHERE id = ?",
      [user.id],
      (err) => {
        if (err) return res.status(500).send(err);

        if (user.role === "vendor") {
          db.query(
            "INSERT INTO vendors (user_id, name, category, gst_number, contact_person, email, phone, status) VALUES (?, ?, 'Office Supplies', 'PENDING', ?, ?, 'PENDING', 'Active')",
            [user.id, user.name, user.name, user.email],
            (vErr) => {
              if (vErr) {
                console.error("Failed to auto-seed vendor profile on verification:", vErr.message);
              }
              res.send("Verification successful");
            }
          );
        } else {
          res.send("Verification successful");
        }
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password });
  if (!email || !password) return res.status(400).send('Email and password are required');
  const cleanEmail = email?.trim().toLowerCase();
  db.query("SELECT * FROM users WHERE email = ?", [cleanEmail], (err, result) => {
    // existing logic unchanged below
    if (err) return res.status(500).send(err);

    const user = result[0];
    if (!user) return res.status(404).send("User not found");

    if (!user.verified) {
      return res.status(400).send("Please verify your email using the registration OTP code sent to you.");
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  });
};

exports.googleLogin = async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).send("Google access token is required");
  }

  try {
    let email, name;

    // Check if using a simulated token for sandbox testing
    if (access_token.startsWith("mock_token_")) {
      email = access_token.replace("mock_token_", "");
      const baseName = email.split("@")[0].replace(/[^a-zA-Z]/g, " ");
      name = baseName.trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Google User";
    } else {
      // Call Google OAuth UserInfo endpoint using native Node fetch
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      
      if (!response.ok) {
        return res.status(401).send("Invalid Google access token");
      }

      const profile = await response.json();
      email = profile.email;
      name = profile.name;
    }

    if (!email) {
      return res.status(400).send("Google account does not expose a valid email address");
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length > 0) {
        const user = results[0];
        // If they already exist, auto-verify if they weren't verified
        db.query("UPDATE users SET verified = 1 WHERE id = ?", [user.id], (updateErr) => {
          if (updateErr) return res.status(500).send(updateErr);
          
          const token = jwt.sign(
            { id: user.id, role: user.role },
            "secretkey",
            { expiresIn: "1d" }
          );

          res.json({ token, user: { ...user, verified: 1 } });
        });
      } else {
        // Create new user automatically via Google SSO
        const randomPassword = Math.random().toString(36).substring(2, 12);
        const hash = bcrypt.hashSync(randomPassword, 10);
        const defaultRole = "procurement"; // Default role for auto-onboarded Google users

        db.query(
          "INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)",
          [name, email, hash, defaultRole, 1],
          (insertErr, insertResult) => {
            if (insertErr) return res.status(500).send(insertErr);

            const newUserId = insertResult.insertId;
            const newUser = { id: newUserId, name, email, role: defaultRole, verified: 1 };

            const token = jwt.sign(
              { id: newUserId, role: defaultRole },
              "secretkey",
              { expiresIn: "1d" }
            );

            res.json({ token, user: newUser });
          }
        );
      }
    });
  } catch (error) {
    console.error("Google OAuth token exchange error:", error);
    res.status(500).send("Failed to authenticate with Google: " + error.message);
  }
};