const ProfileFavorite = require('../models/ProfileFavorite');

// Obtener favoritos de un perfil
exports.getFavoritesByProfile = async (req, res) => {
    const { profile_id } = req.params;
    try {
        const favorites = await ProfileFavorite.getByProfile(profile_id);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agregar un favorito
exports.addFavorite = async (req, res) => {
    const { profile_id, content_id } = req.body;
    if (!profile_id || !content_id) {
        return res.status(400).json({ message: "Faltan campos obligatorios (profile_id, content_id)" });
    }
    try {
        const newId = await ProfileFavorite.add(profile_id, content_id);
        res.status(201).json({ message: "Favorito agregado", id: newId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar favorito
exports.removeFavorite = async (req, res) => {
    const { profile_id, content_id } = req.params;
    if (!profile_id || !content_id) {
        return res.status(400).json({ message: "Faltan campos obligatorios (profile_id, content_id)" });
    }
    try {
        const deleted = await ProfileFavorite.remove(profile_id, content_id);
        if (!deleted) return res.status(404).json({ message: "Favorito no encontrado" });
        res.json({ message: "Favorito eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};