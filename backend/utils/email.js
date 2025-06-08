const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporte con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Correo de confirmación de registro simple
const enviarCorreoRegistro = async (destinatario, nombre) => {
  await transporter.sendMail({
    from: `"Sistema de Registro" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '🎉 Registro exitoso',
    html: `<h3>Hola ${nombre},</h3>
           <p>Tu registro fue exitoso. ¡Bienvenido/a al sistema! 🌱</p>`
  });
};

// Correo con la nueva contraseña (recuperación)
const enviarCorreoClave = async (destinatario, nombre, clave) => {
  await transporter.sendMail({
    from: `"Soporte Sistema" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '🔐 Recuperación de contraseña',
    html: `
      <p>Hola ${nombre},</p>
      <p>Tu nueva contraseña es: <strong>${clave}</strong></p>
      <p>Por favor inicia sesión en el sistema.</p>`
  });
};

// Correo cuando el usuario es creado desde el admin
const enviarCredenciales = async (destinatario, nombre, usuario, clave) => {
  await transporter.sendMail({
    from: `"Soporte Sistema" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '📩 Credenciales de acceso al sistema',
    html: `
      <p>Hola ${nombre},</p>
      <p>Tu cuenta ha sido creada. A continuación tus credenciales de acceso:</p>
      <ul>
        <li><strong>Usuario:</strong> ${usuario}</li>
        <li><strong>Contraseña:</strong> ${clave}</li>
      </ul>
      <p>¡Bienvenido/a al sistema!</p>`
  });
};

module.exports = { enviarCorreoRegistro, enviarCorreoClave, enviarCredenciales };
