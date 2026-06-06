const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, hash, role],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User registered");
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) return res.status(500).send(err);

    const user = result[0];

    if (!user) return res.status(404).send("User not found");

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