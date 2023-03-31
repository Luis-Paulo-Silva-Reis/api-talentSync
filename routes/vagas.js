const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/jobsposting", verifyToken, async (req, res) => {
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

router.get("/jobsposting/:id", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId; // Obter user_id diretamente do token verificado
    const { id } = req.params;
    const result = await pool.query(
      "SELECT titulo, descricao FROM Vagas WHERE vaga_id = ? AND user_id = ?",
      [id, user_id]
    );
    if (!result[0]) return res.status(404).json({ error: "Vaga não encontrada." });
    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
});

router.get("/jobsposting", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId; // Obter user_id diretamente do token verificado
    const result = await pool.query(
      "SELECT vaga_id, titulo, descricao FROM Vagas WHERE user_id = ?",
      [user_id]
    );
    res.status(200).json(result);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
});






module.exports = router;
