// controllers/genres.controller.js
const mongoose = require('../config/db');
const Genre = require('../models/Genre');

const isValidId = (id) => mongoose.isValidObjectId(id);

exports.getAllGenres = async (_req, res) => {
  try {
    const genres = await Genre.getAll();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const name = (req.body?.name || '').trim();
    const description = (req.body?.description || '').trim();

    if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });

    const newGenreId = await Genre.create(name, description);
    return res.status(201).json({ id: newGenreId, name, description });
  } catch (error) {
    // E11000 = duplicate key (índice único)
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un género con ese nombre' });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'ID inválido' });

    const genre = await Genre.getById(id);
    if (!genre) return res.status(404).json({ message: 'Género no encontrado' });

    return res.json(genre);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'ID inválido' });

    const name = req.body?.name !== undefined ? String(req.body.name).trim() : undefined;
    const description = req.body?.description !== undefined ? String(req.body.description).trim() : undefined;

    const updated = await Genre.update(id, { name, description });
    if (!updated) return res.status(404).json({ message: 'Género no encontrado' });

    return res.json({ id, name, description });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un género con ese nombre' });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'ID inválido' });

    const deleted = await Genre.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Género no encontrado' });

    return res.json({ message: 'Género eliminado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};