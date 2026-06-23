import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

// Configuración adaptada con host explícito y desactivación de restricciones de red locales
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false para puerto 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Esto evita que falle si la red de Render intenta interceptar o alterar la conexión segura
    rejectUnauthorized: false
  }
});

// Esta función manejará la creación de un nuevo mensaje y la notificación por email
export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newMessage = new Message({
      name,
      email,
      message
    });

    // Guardamos PRIMERO en la base de datos (Garantiza que el mensaje no se pierda)
    const savedMessage = await newMessage.save();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `💼 Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8b5cf6;">¡Tenés un nuevo mensaje en tu Portfolio!</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email de contacto:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    };

    // Despachamos el email. Al estar fuera del flujo síncrono crítico, si Render
    // sigue bloqueando el puerto, el cliente en el frontend recibirá igual su cartel de éxito.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el email de notificación:', error);
      } else {
        console.log('Email de notificación enviado con éxito:', info.response);
      }
    });

    // Respondemos inmediatamente al usuario
    res.status(201).json({ 
      success: true, 
      message: '¡Mensaje enviado con éxito!', 
      data: savedMessage 
    });

  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar el mensaje' });
  }
};