// src/services/token.service.js

import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Asumiendo que tienes un pool de DB configurado

/**
 * Genera un par de tokens: Access Token y Refresh Token.
 * @param {object} payload - El contenido que irá en el Access Token (ej. { id: userId }).
 * @returns {{accessToken: string, refreshToken: string}}
 */
export const generateTokens = (payload) => {
  // El Access Token contiene el payload completo.
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  // El Refresh Token solo necesita el ID del usuario.
  // Esto es más seguro y eficiente.
  const refreshTokenPayload = { id: payload.id };
  const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};


/**
 * Guarda un refresh token en la base de datos, asociándolo a un usuario.
 * @param {string} userId - El ID del usuario.
 * @param {string} token - El refresh token a guardar.
 */
export const saveRefreshToken = async (userId, token) => {
  try {
    // Borramos cualquier token viejo que pueda tener el usuario para evitar basura.
    const deleteQuery = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    await pool.query(deleteQuery, [userId]);

    // Insertamos el nuevo refresh token.
    const insertQuery = 'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)';
    await pool.query(insertQuery, [userId, token]);
  } catch (error) {
    console.error('Error al guardar el refresh token:', error);
    throw new Error('No se pudo guardar el token de refresco.');
  }
};


/**
 * Verifica un refresh token.
 * @param {string} token - El refresh token enviado por el cliente.
 * @returns {Promise<object>} - El payload del token si es válido.
 */
export const verifyRefreshToken = async (token) => {
  // 1. Busca el token en la base de datos
  const query = 'SELECT * FROM refresh_tokens WHERE token = ?';
  const [rows] = await pool.query(query, [token]);

  if (rows.length === 0) {
    // Si no está en la DB, es inválido
    throw new Error('Refresh token no encontrado o revocado.');
  }

  // 2. Verifica la firma y expiración del token usando el secreto de REFRESH
  // jwt.verify lanzará un error automáticamente si es inválido o ha expirado
  const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  return userData;
};