// src/utils/errorHandler.js

/**
 * Middleware para manejar errores de forma centralizada.
 * @param {Error} err - El objeto de error.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Si el error tiene un código de estado definido, úsalo. Si no, es un error 500.
  const statusCode = err.statusCode || 500;

  // Imprime el error en la consola (importante para depuración en desarrollo)
  console.error(err.stack);

  // Envía una respuesta JSON estandarizada
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Ha ocurrido un error interno en el servidor.'
  });
};

export default errorHandler;