const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(5000, () => console.log("🚀 Serveur Node.js lancé sur le port 5000"));