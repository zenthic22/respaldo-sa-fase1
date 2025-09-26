// controllers/profileFavorites.controller.js
const mongoose = require('../config/db');
const ProfileFavorite = require('../models/ProfileFavorite');

const isValidId = (id) => mongoose.isValidObjectId(id);
const toProfileNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// GET /api/favorites/:profile_id
exports.getFavoritesByProfile = async (req, res) => {
  try {
    const pid = toProfileNumber(req.params.profile_id);
    if (pid === null) {
      return res.status(400).json({ message: 'profile_id inválido' });
    }
    const favorites = await ProfileFavorite.getByProfile(pid);
    return res.json(favorites);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/favorites
// body: { profile_id: number, content_id: ObjectId string }
exports.addFavorite = async (req, res) => {
  try {
    const pid = toProfileNumber(req.body?.profile_id);
    const content_id = req.body?.content_id;

    if (pid === null || !content_id) {
      return res
        .status(400)
        .json({ message: 'Faltan campos obligatorios (profile_id, content_id)' });
    }
    if (!isValidId(content_id)) {
      return res.status(400).json({ message: 'content_id inválido' });
    }

    const newId = await ProfileFavorite.add(pid, content_id);
    return res.status(201).json({ message: 'Favorito agregado', id: newId });
  } catch (error) {
    // índice único (profile_id + content) → duplicado
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'El contenido ya está en favoritos' });
    }
    // cast errors/validation
    if (error?.name === 'CastError' || error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/favorites/:profile_id/:content_id
exports.removeFavorite = async (req, res) => {
  try {
    const pid = toProfileNumber(req.params.profile_id);
    const content_id = req.params.content_id;

    if (pid === null || !content_id) {
      return res
        .status(400)
        .json({ message: 'Faltan campos obligatorios (profile_id, content_id)' });
    }
    if (!isValidId(content_id)) {
      return res.status(400).json({ message: 'content_id inválido' });
    }

    const deleted = await ProfileFavorite.remove(pid, content_id);
    if (!deleted) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }
    return res.json({ message: 'Favorito eliminado' });
  } catch (error) {
    if (error?.name === 'CastError') {
      return res.status(400).json({ message: 'content_id inválido' });
    }
    return res.status(500).json({ message: error.message });
  }
};