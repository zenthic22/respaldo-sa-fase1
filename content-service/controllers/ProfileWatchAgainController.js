const ProfileWatchAgain = require('../models/ProfileWatchAgain');

exports.getWatchAgainByProfile = async (req, res) => {
  const { profile_id } = req.params;

  try {
    const list = await ProfileWatchAgain.getByProfile(profile_id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addWatchAgain = async (req, res) => {
  const { profile_id, content_id } = req.body;

  try {
    if (!profile_id || !content_id) {
      return res.status(400).json({ message: "Faltan campos obligatorios (profile_id, content_id)" });
    }

    const newId = await ProfileWatchAgain.add(profile_id, content_id);
    res.status(201).json({ message: "Contenido agregado a 'Ver de nuevo'", id: newId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeWatchAgain = async (req, res) => {
  const { profile_id, content_id } = req.params;

  try {
    const removed = await ProfileWatchAgain.remove(profile_id, content_id);
    if (!removed) {
      return res.status(404).json({ message: "Contenido no encontrado en la lista de ver de nuevo" });
    }
    res.json({ message: "Contenido eliminado de ver de nuevo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};