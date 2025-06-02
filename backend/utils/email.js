// Importación de Nodemailer para el envío de correos electrónicos
const nodemailer = require('nodemailer');

// Carga de variables de entorno desde el archivo .env
require('dotenv').config();

// Configuración del transporte de correos usando Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // Servicio de correo utilizado
  auth: {
    user: process.env.EMAIL_USER, // Usuario de correo obtenido desde el entorno
    pass: process.env.EMAIL_PASS  // Contraseña de correo obtenida desde el entorno
  }
});

// Función para enviar un correo de confirmación de registro
const enviarCorreoRegistro = async (destinatario, nombre) => {
  await transporter.sendMail({
    from: `"Sistema de Registro" <${process.env.EMAIL_USER}>`, // Remitente del correo
    to: destinatario, // Dirección de correo del destinatario
    subject: '🎉 Registro exitoso', // Asunto del correo
    html: `<h3>Hola ${nombre},</h3>
           <p>Tu registro fue exitoso. ¡Bienvenido/a al sistema! 🌱</p>` // Contenido en HTML del correo
  });
};

// Función para enviar un correo con una nueva contraseña temporal
const enviarCorreoClave = async (destinatario, nombre, clave) => {
  await transporter.sendMail({
    from: `"Soporte Sistema" <${process.env.EMAIL_USER}>`, // Remitente del correo
    to: destinatario, // Dirección de correo del destinatario
    subject: '🔐 Recuperación de contraseña', // Asunto del correo
    html: `
      <p>Hola ${nombre},</p>
      <p>Tu nueva contraseña temporal es: <strong>${clave}</strong></p>
      <p>Por favor inicia sesión y cámbiala lo antes posible.</p>` // Contenido en HTML con la clave temporal
  });
};

// Exportación de funciones para ser utilizadas en otros archivos
module.exports = { enviarCorreoRegistro, enviarCorreoClave };