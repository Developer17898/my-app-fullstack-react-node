const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_app'
});
conn.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connecté');
});
module.exports = conn;
