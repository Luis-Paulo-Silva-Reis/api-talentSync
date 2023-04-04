const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/jobsposting", verifyToken, (req, res) => {
  const user_id = req.user.id; // Getting the user_id directly from the verified token
  const { titulo, descricao } = req.body;
  pool.query(
    "INSERT INTO Vagas (user_id, titulo, descricao) VALUES (?, ?, ?)",
    [user_id, titulo, descricao],
    (error, result, fields) => {
      if (error) {
        console.log("Database error:", error);
        res.status(400).json({ error: "Erro ao inserir a vaga." });
      } else {
        res
          .status(201)
          .json({ message: "Vaga inserida com sucesso.", vaga_id: result.insertId });
      }
    }
  );
});

router.get("/jobsposting/:id", verifyToken, (req, res) => {
  const user_id = req.user.id; // Getting the user_id directly from the verified token
  const { id } = req.params;
  pool.query(
    "SELECT titulo, descricao FROM Vagas WHERE vaga_id = ? AND user_id = ?",
    [id, user_id],
    (error, result, fields) => {
      if (error) {
        console.log("Database error:", error);
        res.status(500).json({ error: "Erro ao acessar o banco de dados." });
      } else if (result.length < 1) {
        return res.status(404).json({ error: "Vaga não encontrada." });
      } else {
        res.status(200).json(result[0]);
      }
    }
  );
});

router.get("/jobs", verifyToken, (req, res) => {
  pool.query("SELECT titulo, descricao FROM Vagas;", (error, result, fields) => {
    if (error) {
      console.log("Database error:", error);
      res.status(500).json({ error: "Erro ao acessar o banco de dados." });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Nenhum resultado encontrado." });
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
