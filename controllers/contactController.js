import Message from '../models/Message.js';
import { Resend } from 'resend';

// Inicializamos Resend con la API Key de las variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 1. Guardamos de forma segura en la base de datos
    const savedMessage = await newMessage.save();

    // 2. Enviamos el correo usando la API HTTP segura de Resend (Puerto 443)
    // Resend en su plan gratuito permite enviar correos desde "onboarding@resend.dev" hacia tu propio mail registrado.
    resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.RECIPIENT_EMAIL, // Tu email personal donde querés que llegue
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
    }).then(response => {
      if (response.error) {
        console.error('Error de Resend API:', response.error);
      } else {
        console.log('¡Email enviado con éxito mediante API HTTP!', response.data.id);
      }
    }).catch(err => {
      console.error('Error crítico al conectar con Resend:', err);
    });

    // Respondemos al frontend con éxito sin demoras
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