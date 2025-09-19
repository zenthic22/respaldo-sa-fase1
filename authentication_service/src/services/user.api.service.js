// src/services/user.api.service.js

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

// La URL base de nuestro servicio de usuarios, leída desde .env
const USERS_API_URL = process.env.USERS_SERVICE_URL;

/**
 * Llama al endpoint de registro del users-service.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} - Los datos del usuario creado.
 */
export const createUser = async (data) => {
  try {
    // Hacemos un POST a 'http://localhost:4002/api/users/register'
    const url = `${USERS_API_URL}/users`;
    console.log("this is the fucking url", url);
    const response = await axios.post(url , data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.error || 'Error al crear el usuario');
  }
};

/**
 * Llama a un endpoint en users-service para validar las credenciales.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} - Los datos del usuario si las credenciales son correctas.
 */
export const validateUserCredentials = async (email, password) => {
  try {
    // Hacemos un POST a 'http://localhost:4002/api/users/validate'
    // Este endpoint en users-service debe verificar email y contraseña.
    const response = await axios.post(`${USERS_API_URL}/users/validate`, { email, password });
    return response.data; // Debería devolver el { id, email } del usuario
  } catch (error) {
    throw new Error(error.response.error || 'Credenciales inválidas');
  }
};