module.exports = {
  exibirMensagem(status, mensagem) {
    if (status === "success") {
      console.log("Email enviado com sucesso!");
    } else {
      console.log("Erro ao enviar email:", mensagem);
    }
  },
};
