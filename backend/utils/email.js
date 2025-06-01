const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'proyectoingenieria05@gmail.com',       // tu correo aquí
    pass: 'Colombia2025'                           // tu contraseña o contraseña de aplicación aquí
  }
});

async function enviarCorreoRegistro(destino, nombres) {
  const mailOptions = {
    from: '"Proyecto Ingeniería" <proyectoingenieria05@gmail.com>',
    to: destino,
    subject: 'Registro exitoso en la aplicación',
    text: `Hola ${nombres},\n\nGracias por registrarte en nuestra aplicación.\n\nSaludos,\nEl equipo de Proyecto Ingeniería`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { enviarCorreoRegistro };
