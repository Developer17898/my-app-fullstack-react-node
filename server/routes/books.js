const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des livres" });
    res.json(result);
  });
});

router.post('/', verifyToken, (req, res) => {
  const { title, author, description } = req.body;
  db.query("INSERT INTO books(title, author, description) VALUES (?, ?, ?)",
    [title, author, description],
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'ajout du livre" });
      res.status(201).json({ message: "✅ Livre ajouté avec succès" });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { title, author, description } = req.body;
  db.query("UPDATE books SET title=?, author=?, description=? WHERE id=?",
    [title, author, description, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la modification du livre" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Livre non trouvé" });
      res.json({ message: "✅ Livre modifié avec succès" });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la suppression du livre" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Livre non trouvé" });
    res.json({ message: "✅ Livre supprimé avec succès" });
  });
});

module.exports = router;