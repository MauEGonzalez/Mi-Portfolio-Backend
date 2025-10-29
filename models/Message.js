import mongoose from 'mongoose';

// 1. Definimos el Schema (la plantilla)
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true, // Quita espacios en blanco al inicio y al final
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
  }
}, {
  timestamps: true // 2. Agrega automáticamente 'createdAt' y 'updatedAt'
});

// 3. Creamos y exportamos el Modelo
// Mongoose tomará 'Message', lo pondrá en minúscula y plural ('messages')
// y ese será el nombre de la colección en la base de datos.
const Message = mongoose.model('Message', messageSchema);

export default Message;