import mongoose from 'mongoose';

// Esta será nuestra función de conexión
const connectDB = async () => {
  try {
    // Intentamos conectarnos. Usamos process.env.MONGO_URI para leer la variable del .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Si tenemos éxito, mostramos un mensaje en la consola
    console.log(`MongoDB Conectado: ${conn.connection.host}`);

  } catch (error) {
    // Si hay un error, lo mostramos y cerramos la aplicación
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Exportamos la función para poder usarla en server.js
export default connectDB;