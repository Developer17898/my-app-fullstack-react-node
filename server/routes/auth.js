const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query("INSERT INTO users(email, password) VALUES (?, ?)", [email, hashed], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Utilisateur inscrit");
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err || result.length === 0) return res.status(401).json("Identifiants invalides");
    const match = await bcrypt.compare(password, result[0].password);
    if (!match) return res.status(401).json("Mot de passe incorrect");
    const token = jwt.sign({ id: result[0].id }, "secret123", { expiresIn: "1h" });
    res.json({ token });
  });
});

module.exports = router;