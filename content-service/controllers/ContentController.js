// controllers/content.controller.js
const mongoose = require('../config/db');
const Content = require('../models/Content');

const isValidId = (id) => mongoose.isValidObjectId(id);
const toNumberOrNull = (v) =>
  v === '' || v === null || typeof v === 'undefined' ? null : Number(v);
const toDateOrNull = (v) => (v ? new Date(v) : null);
const assertGenresIds = (arr) =>
  Array.isArray(arr) && arr.every((g) => typeof g === 'string' && isValidId(g));

/**
 * GET /api/contents
 */
exports.getAllContents = async (_req, res) => {
  try {
    const contents = await Content.getAll();
    return res.json(contents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/contents
 * body: { title, description, release_date, type, rating, duration, video_filename, poster_url, genres }
 */
exports.createContent = async (req, res) => {
  try {
    const {
      title,
      description,
      release_date,
      type,
      rating,
      duration,
      video_filename,
      poster_url,
      genres,
    } = req.body || {};

    // Validaciones mínimas
    if (!title || !type) {
      return res.status(400).json({ message: 'title y type son obligatorios' });
    }
    // Si se envían géneros, valida que sean ObjectIds
    if (genres !== undefined && !assertGenresIds(genres)) {
      return res.status(400).json({ message: 'genres debe ser un arreglo de ObjectId válidos' });
    }

    const newContentId = await Content.create({
      title: String(title).trim(),
      description: description !== undefined ? String(description).trim() : undefined,
      release_date: release_date !== undefined ? toDateOrNull(release_date) : undefined,
      type,
      rating: toNumberOrNull(rating),
      duration: toNumberOrNull(duration),
      video_filename: video_filename || null,
      poster_url: poster_url || null,
      genres,
    });

    return res.status(201).json({ message: 'Contenido creado', id: newContentId });
  } catch (error) {
    // Errores de validación de Mongoose → 400
    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/contents/:id
 */
exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const content = await Content.getById(id);
    if (!content) {
      return res.status(404).json({ message: 'Contenido no encontrado' });
    }
    return res.json(content);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/contents/:id
 * body: campos parciales; si envías genres, reemplaza completamente
 */
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const {
      title,
      description,
      release_date,
      type,
      rating,
      duration,
      video_filename,
      poster_url,
      genres,
    } = req.body || {};

    if (genres !== undefined && !assertGenresIds(genres)) {
      return res.status(400).json({ message: 'genres debe ser un arreglo de ObjectId válidos' });
    }

    const updated = await Content.update(id, {
      // Solo setea si vienen definidos (el modelo ya lo maneja, pero dejamos claro aquí)
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(description !== undefined ? { description: String(description).trim() } : {}),
      ...(release_date !== undefined ? { release_date: toDateOrNull(release_date) } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(rating !== undefined ? { rating: toNumberOrNull(rating) } : {}),
      ...(duration !== undefined ? { duration: toNumberOrNull(duration) } : {}),
      ...(video_filename !== undefined ? { video_filename } : {}),
      ...(poster_url !== undefined ? { poster_url } : {}),
      ...(genres !== undefined ? { genres } : {}),
    });

    if (!updated) {
      return res.status(404).json({ message: 'Contenido no encontrado' });
    }
    return res.json({ message: 'Contenido actualizado' });
  } catch (error) {
    if (error?.name === 'ValidationError' || error?.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/contents/:id
 */
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deleted = await Content.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contenido no encontrado' });
    }
    return res.json({ message: 'Contenido eliminado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};