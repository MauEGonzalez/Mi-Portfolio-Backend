import Message from '../models/Message.js';

// Esta función manejará la creación de un nuevo mensaje
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

    // 5. Respondemos al frontend con éxito (código 201 = Creado)
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