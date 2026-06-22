import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

// Configuración del transportador de Nodemailer usando las variables de entorno
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // La contraseña de aplicación de 16 letras
  },
});

// Esta función manejará la creación de un nuevo mensaje y la notificación por email
export const createMessage = async (req, res) => {
  try {
    // 1. Obtenemos los datos que el frontend envía en el 'body'
    const { name, email, message } = req.body;

    // 2. Validación simple (aunque el modelo también valida)
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // 3. Creamos una nueva instancia del modelo
    const newMessage = new Message({
      name,
      email,
      message
    });

    // 4. Guardamos el nuevo mensaje en la base de datos
    const savedMessage = await newMessage.save();

    // 5. Configuración del correo electrónico que te va a llegar a vos
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL, // Tu correo personal donde querés enterarte
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

    // 6. Enviamos el correo de forma asíncrona
    // No usamos 'await' directo aquí si no queremos retrasar la respuesta al cliente,
    // pero lo ideal es manejarlo para asegurar el envío o registrar fallos.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el email de notificación:', error);
      } else {
        console.log('Email de notificación enviado con éxito:', info.response);
      }
    });

    // 7. Respondemos al frontend con éxito (código 201 = Creado)
    res.status(201).json({ 
      success: true, 
      message: '¡Mensaje enviado con éxito!', 
      data: savedMessage 
    });

  } catch (error) {
    // Si algo falla (ej. validación de Mongoose), respondemos con un error
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar el mensaje' });
  }
};