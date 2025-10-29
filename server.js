import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from './routes/contactRoutes.js'; // <-- 1. IMPORTAMOS LAS RUTAS

// Configurar dotenv
dotenv.config();

// Conectar a la DB
connectDB();

// Inicializar Express
const app = express();

// Definir el puerto
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // ¡Muy importante para que 'req.body' funcione!

// --- 2. RUTAS DE LA API ---
// Le decimos a Express: "Cualquier petición que empiece con '/api',
// mándasela a 'contactRoutes' para que él decida qué hacer".
app.use('/api', contactRoutes);

// Ruta de prueba (la movemos después de la API)
app.get('/', (req, res) => {
  res.json({ message: "¡El servidor de mi portfolio está funcionando!" });
});

// Poner el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});