const emailModel = require('../models/emailModel');
const emailView = require('../views/emailView');

async function enviarEmail(req, res) {
    try {
        const result = await emailModel.enviarEmail(req.body.destinatario, req.body.assunto, req.body.conteudo);
        emailView.exibirMensagem('success', result);
        res.status(200).send('Email enviado com sucesso!');
    } catch (error) {
        emailView.exibirMensagem('error', error);
        res.status(500).send('Erro ao enviar email: ' + error);
    }
}

module.exports = { enviarEmail };
