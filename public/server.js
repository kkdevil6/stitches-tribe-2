const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PUBLIC_DIR = path.join(__dirname);
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({ dest: UPLOADS_DIR });
const dbPath = path.join(__dirname, 'db', 'quotes.db');
const db = new sqlite3.Database(dbPath);

app.use(express.static(PUBLIC_DIR));
app.use(express.json());

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    service TEXT,
    file_path TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/submit-quote', upload.single('design'), (req, res) => {
  const { name, email, phone, service, message } = req.body;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = `INSERT INTO quotes (name, email, phone, service, file_path, message) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, email, phone, service, file_path, message], function(err) {
    if (err) {
      console.error('DB insert error', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: this.lastID });
  });
});

// simple healthcheck
app.get('/_health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
