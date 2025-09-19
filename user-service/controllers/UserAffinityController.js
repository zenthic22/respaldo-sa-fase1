const { UserAffinity } = require("../models");

// Obtener afinidades de un usuario
exports.getAffinitiesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const affinities = await UserAffinity.getByUser(user_id);
    res.json(affinities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar afinidad
exports.addAffinity = async (req, res) => {
  const { user_id, category_code } = req.body;
  try {
    await UserAffinity.create(user_id, category_code);
    res.status(201).json({ message: "Afinidad agregada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar afinidad
exports.removeAffinity = async (req, res) => {
  const { user_id, category_code } = req.params;
  try {
    await UserAffinity.delete(user_id, category_code);
    res.json({ message: "Afinidad eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};