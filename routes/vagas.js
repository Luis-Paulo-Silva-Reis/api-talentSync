const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/vagas", verifyToken, (req, res) => {
  const user_id = req.userId; // Obter user_id diretamente do token verificado
  const { titulo, descricao } = req.body;

  insertVaga(pool, user_id, titulo, descricao, (error, vaga_id) => {
    if (error) {
      return res.status(400).json({ error: "Erro ao inserir a vaga." });
    }
    res.status(201).json({ message: "Vaga inserida com sucesso.", vaga_id });
  });
});

function insertVaga(pool, user_id, titulo, descricao, callback) {
  const sql = "INSERT INTO Vagas (user_id, titulo, descricao) VALUES (?, ?, ?)";
  pool.query(sql, [user_id, titulo, descricao], (err, results) => {
    if (err) {
      console.log("Database error:", err); // Adicione esta linha para registrar o erro do banco de dados
      return callback(err, null);
    }
    return callback(null, results.insertId);
  });
}

module.exports = router;
