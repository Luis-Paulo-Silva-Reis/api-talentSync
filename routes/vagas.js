const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/vagas", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId; // Obter user_id diretamente do token verificado
    const { titulo, descricao } = req.body;
    const { insertId } = await pool.query(
      "INSERT INTO Vagas (user_id, titulo, descricao) VALUES (?, ?, ?)",
      [user_id, titulo, descricao]
    );
    res
      .status(201)
      .json({ message: "Vaga inserida com sucesso.", vaga_id: insertId });
  } catch (error) {
    console.log("Database error:", error); // Adicione esta linha para registrar o erro do banco de dados
    res.status(400).json({ error: "Erro ao inserir a vaga." });
  }
});

module.exports = router;
