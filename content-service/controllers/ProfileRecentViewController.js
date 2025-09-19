const ProfileRecentView = require('../models/ProfileRecentView');

exports.getRecentViewsByProfile = async (req, res) => {
  const { profile_id } = req.params;

  try {
    const views = await ProfileRecentView.getByProfile(profile_id);
    res.json(views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRecentView = async (req, res) => {
  const { profile_id, content_id } = req.body;

  try {
    if (!profile_id || !content_id) {
      return res.status(400).json({ message: "Faltan campos obligatorios (profile_id, content_id)" });
    }

    const newId = await ProfileRecentView.add(profile_id, content_id);
    res.status(201).json({ message: "Visualización registrada", id: newId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecentView = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await ProfileRecentView.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Visualización no encontrada" });
    }

    res.json({ message: "Visualización eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};