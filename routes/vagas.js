const express = require("express");
const pool = require("../database/db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/jobsposting", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId; // Obter user_id diretamente do token verificado
    const {
      titulo,
      descricao,
      empresa,
      localizacao,
      tipoEmprego,
      salario,
      requisitosAdicionais,
      experienciaMinima,
      dataPublicacao,
      dataExpiracao,
      linkAplicacao,
      status
    } = req.body;

    const { insertId } = await pool.query(
      "INSERT INTO Vagas (user_id, titulo, descricao, empresa, localizacao, tipo_emprego, salario, requisitos_adicionais, experiencia_minima, data_publicacao, data_expiracao, link_aplicacao, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        titulo,
        descricao,
        empresa,
        localizacao,
        tipoEmprego,
        salario,
        requisitosAdicionais,
        experienciaMinima,
        dataPublicacao,
        dataExpiracao,
        linkAplicacao,
        status
      ]
    );

    res
      .status(201)
      .json({ message: "Vaga inserida com sucesso.", vaga_id: insertId });
  } catch (error) {
    console.log("Database error:", error); // Adicione esta linha para registrar o erro do banco de dados
    res.status(400).json({ error: "Erro ao inserir a vaga." });
  }
});

router.get("/jobs", (req, res) => {
  pool.query(
    "SELECT id, titulo, descricao, empresa, localizacao, tipo_emprego, salario, requisitos_adicionais, experiencia_minima, data_publicacao, data_expiracao, link_aplicacao, status FROM Vagas;",
    (error, result, fields) => {
      if (error) {
        console.log("Database error:", error);
        return res.status(500).json({ error: "Erro ao acessar o banco de dados." });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Nenhum resultado encontrado." });
      }
      
      res.status(200).json(result);
    }
  );
});

router.get("/jobs/:id", (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  pool.query(
    "SELECT id, titulo, descricao, empresa, localizacao, tipo_emprego, salario, requisitos_adicionais, experiencia_minima, data_publicacao, data_expiracao, link_aplicacao, status FROM Vagas WHERE id = ? AND user_id = ?",
    [id, user_id],
    (error, result, fields) => {
      if (error) {
        console.log("Database error:", error);
        return res.status(500).json({ error: "Erro ao acessar o banco de dados." });
      }
      
      if (result.length < 1) {
        return res.status(404).json({ error: "Vaga não encontrada." });
      }
      
      res.status(200).json(result[0]);
    }
  );
});


module.exports = router;
