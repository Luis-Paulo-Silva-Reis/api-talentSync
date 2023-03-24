const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o e-mail já está cadastrado
    const emailCheck = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const [emailCheckResult] = await pool.query(emailCheck, [email]);
    if (emailCheckResult[0].count > 0) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere usuário no banco de dados
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [insertResult] = await pool.query(sql, [
      name,
      email,
      hashedPassword,
    ]);
    const userId = insertResult.insertId;

    // Gera token JWT e retorna na resposta
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ userId, name, email, token });
  } catch (error) {
    console.error("Error registering user: " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rota para autenticação de usuário
router.post("/auth", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o e-mail existe no banco de dados
    const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
    const [results] = await pool.query(sql, [email]);
    if (results.length !== 1) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compara a senha digitada com a senha armazenada no banco de dados
    const passwordMatch = await bcrypt.compare(password, results[0].password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Gera token JWT e retorna na resposta
    const token = jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      id: results[0].id,
      name: results[0].name,
      email: results[0].email,
      token: token,
    });
  } catch (error) {
    console.error("Error authenticating user: " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/protected", verifyToken, (req, res) => {
  // Os dados do usuário estão disponíveis na propriedade "user" do objeto "req"
  const userData = req.user;

  // Você pode enviar uma resposta JSON que inclua os dados do usuário:
  res.json({
    message: "This is a protected route",
    user: userData,
  });
});

module.exports = router;
