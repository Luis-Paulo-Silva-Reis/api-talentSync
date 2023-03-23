const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database with threadId: " + connection.threadId);
});

app.use(express.json());
app.use(helmet());

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader); // exibe o valor do cabeçalho Authorization
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "my_secret_key", (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid token" });
      } else {
        req.userId = decoded.userId;
        next();
        console.log("bem vindo 1");
        function sayHello2() {
          alert("Hello!1");
        }
        sayHello2();
      }
    });
  } else {
    res.status(401).json({ error: "Token missing" });
  }
}

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se o e-mail já foi registrado antes de inserir um novo usuário
  const emailExists = await new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    pool.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });

  if (emailExists) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  // Hash a senha do usuário antes de armazená-la no banco de dados
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  try {
    await pool.query(sql, [name, email, hashedPassword]);
    res.status(201).json({ name, email });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error selecting user from database: " + err.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 1) {
      const passwordMatch = await bcrypt.compare(password, results[0].password);
      if (passwordMatch) {
        res.json({
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.post("/auth", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error selecting user from database: " + err.stack);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 1) {
      const passwordMatch = await bcrypt.compare(password, results[0].password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: results[0].id }, "my_secret_key");
        res.json({
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          token: token,
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route" });
  console.log("bem vindo 2");
  function sayHello() {
    alert("Hello!2");
  }
  sayHello();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
