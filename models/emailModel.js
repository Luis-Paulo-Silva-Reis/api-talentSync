const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "",
  auth: {
    user: "zazal2aden01@gmail.com",
    pass: "mgdhcz8dt",
  },
});

function enviarEmail(destinatario, assunto, conteudo) {
  let mailOptions = {
    from: "zazal2aden01@gmail.com",
    to: destinatario,
    subject: assunto,
    text: conteudo,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email enviado: " + info.response);
        resolve("Email enviado com sucesso!");
      }
    });
  });
}

module.exports = { enviarEmail };
