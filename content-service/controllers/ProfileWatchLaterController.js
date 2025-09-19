const ProfileWatchLater = require('../models/ProfileWatchLater');

exports.getWatchLaterByProfile = async (req, res) => {
  const { profile_id } = req.params;

  try {
    const list = await ProfileWatchLater.getByProfile(profile_id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addWatchLater = async (req, res) => {
  const { profile_id, content_id } = req.body;

  try {
    if (!profile_id || !content_id) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios (profile_id, content_id)" });
    }

    const newId = await ProfileWatchLater.add(profile_id, content_id);
    res
      .status(201)
      .json({ message: "Contenido agregado a 'Ver más tarde'", id: newId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeWatchLater = async (req, res) => {
  const { profile_id, content_id } = req.params;

  try {
    const removed = await ProfileWatchLater.remove(profile_id, content_id);
    if (!removed) {
      return res
        .status(404)
        .json({ message: "Contenido no encontrado en la lista" });
    }
    res.json({ message: "Contenido eliminado de 'Ver más tarde'" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};