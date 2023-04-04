const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/jobsposting", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id; // Getting the user_id directly from the verified token
    const { titulo, descricao } = req.body;
    const [result, fields] = await pool.query(
      "INSERT INTO Vagas (user_id, titulo, descricao) VALUES (?, ?, ?)",
      [user_id, titulo, descricao]
    );
    res
      .status(201)
      .json({ message: "Vaga inserida com sucesso.", vaga_id: result.insertId });
  } catch (error) {
    console.log("Database error:", error); // Adding this line to log the database error
    res.status(400).json({ error: "Erro ao inserir a vaga." });
  }
});

router.get("/jobsposting/:id", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id; // Getting the user_id directly from the verified token
    const { id } = req.params;
    const [result, fields] = await pool.query(
      "SELECT titulo, descricao FROM Vagas WHERE vaga_id = ? AND user_id = ?",
      [id, user_id]
    );
    if (result.length < 1) return res.status(404).json({ error: "Vaga não encontrada." });
    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
});


router.get("/jobs", verifyToken,  (req, res) => {
  pool.query("SELECT titulo, descricao FROM Vagas;", (error, result, fields) => {
    if (error) {
      console.log("Database error:", error);
      res.status(500).json({ error: "Erro ao acessar o banco de dados." });
    } else if (result.length === 0) {
      // se não há resultados, envie uma resposta com o status HTTP 404 (not found)
      res.status(404).json({ error: "Nenhum resultado encontrado." });
    } else {
      // se houver resultados, envie uma resposta com o status HTTP 200 (ok)
      res.status(200).json(result);
    }
  });
});


module.exports = router;
