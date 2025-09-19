import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller.js';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

router.post('/refresh', refresh);

export default router;