const Profile = require("../models/Profile");

// Obtener perfiles de un usuario
exports.getProfilesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const perfiles = await Profile.getByUserId(user_id);
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un perfil por ID
exports.getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const perfil = await Profile.getById(id);
    if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear perfil
exports.createProfile = async (req, res) => {
  const { user_id, name, avatar_url } = req.body;
  try {
    const profileId = await Profile.create(user_id, name, avatar_url);
    res.status(201).json({ message: "Perfil creado", id: profileId });
  } catch (error) {
    if (error.message.includes("maximo de 5 perfiles")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Eliminar perfil
exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    await Profile.delete(id);
    res.json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, avatar_url } = req.body;
  try {
    await Profile.update(id, name, avatar_url);
    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};