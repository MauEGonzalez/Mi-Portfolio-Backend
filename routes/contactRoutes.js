import express from 'express';
import { createMessage } from '../controllers/contactController.js';

// 1. Creamos un router de Express
const router = express.Router();

// 2. Definimos la ruta
// Cuando llegue una petición POST a '/contact' (que será '/api/contact' en total),
// se ejecutará la función 'createMessage'.
router.post('/contact', createMessage);

// 3. Exportamos el router
export default router;