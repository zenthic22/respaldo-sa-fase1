const Genre = require('../models/Genre');

exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.getAll();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createGenre = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "El nombre es obligatorio" });
        }
        const newGenreId = await Genre.create(name, description || null);
        res.status(201).json({ id: newGenreId, name, description });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getGenreById = async (req, res) => {
    const { id } = req.params;
    try {
        const genre = await Genre.getById(id);
        if (!genre) {
            return res.status(404).json({ message: "Genero no encontrado" });
        }
        res.json(genre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateGenre = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updated = await Genre.update(id, { name, description });
        if (!updated) {
            return res.status(404).json({ message: "Género no encontrado" });
        }
        res.json({ id, name, description });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGenre = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Genre.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Genero no encontrado" });
        }
        res.json({ message: "Genero eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}