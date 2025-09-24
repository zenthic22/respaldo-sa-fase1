// src/controllers/auth.controller.js
import * as UserAPIService from '../services/user.api.service.js';

import * as TokenService from '../services/token.service.js';

export const register = async (req, res, next) => {
  const data = req.body;

  // Validaciones básicas (opcional pero recomendado)
  if (!data.email || ! data.password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    // 2. Llama al servicio para crear el usuario
    const newUser = await UserAPIService.createUser(data);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    // El error que relanzamos en el servicio es atrapado aquí
    next(error);

    res.status(409).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    // 3. Llama al servicio para validar las credenciales
    const user = await UserAPIService.validateUserCredentials(email, password);
    // --- PRÓXIMOS PASOS ---
    // Si el usuario es válido, aquí es donde generaremos los tokens.
    // const { accessToken, refreshToken } = TokenService.generateTokens({ id: user.id });
    // await TokenService.saveRefreshToken(user.id, refreshToken);
    // ----------------------
    const tokenPayload = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
        };

        const tokens = TokenService.generateTokens(tokenPayload);

        await TokenService.saveRefreshToken(user.id, tokens.refreshToken);

            res.json({
            message: 'Success in login',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
              id: user.id, 
              email: user.email, 
              name: user.first_name, 
              lastname: user.last_name,
              role: user.role || "USER"
            }
        });

    // res.json({ id: user.id, email: user.email, name: user.first_name, lastname: user.last_name });
  } catch (error) {
    next(error);

    res.status(401).json({ message: error.message });
  }
};

export const refresh = async (req, res, next) => {
  // 1. Obtiene el refresh token del body
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error('Refresh token no proporcionado');
    error.statusCode = 400; // Bad Request
    return next(error);
  }

  try {
    // 2. Llama al servicio para verificar el refresh token
    const userData = await TokenService.verifyRefreshToken(refreshToken);

    // 3. Si es válido, genera un NUEVO access token (¡solo el de acceso!)
    const payload = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    // 4. Envía el nuevo token al cliente
    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    // Si el token es inválido o no se encuentra, el servicio lanzará un error
    error.statusCode = 403; // Forbidden
    next(error);
  }
};