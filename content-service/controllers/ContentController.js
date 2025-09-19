const Content = require('../models/Content');

// Obtener todos los contenidos
exports.getAllContents = async (req, res) => {
    try {
        const contents = await Content.getAll();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un contenido
exports.createContent = async (req, res) => {
    const { title, description, release_date, type, rating, duration, genres } = req.body;
    try {
        const newContentId = await Content.create({
            title,
            description,
            release_date,
            type,
            rating,
            duration,
            genres // ahora también recibe los géneros
        });
        res.status(201).json({ message: "Contenido creado", id: newContentId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un contenido por ID
exports.getContentById = async (req, res) => {
    const { id } = req.params;
    try {
        const content = await Content.getById(id);
        if (!content) {
            return res.status(404).json({ message: "Contenido no encontrado" });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un contenido
exports.updateContent = async (req, res) => {
    const { id } = req.params;
    const { title, description, release_date, type, rating, duration, genres } = req.body;

    try {
        const updated = await Content.update(id, {
            title,
            description,
            release_date,
            type,
            rating,
            duration,
            genres // también actualiza los géneros
        });
        if (!updated) {
            return res.status(404).json({ message: "Contenido no encontrado" });
        }
        res.json({ message: "Contenido actualizado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un contenido
exports.deleteContent = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Content.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Contenido no encontrado" });
        }
        res.json({ message: "Contenido eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};