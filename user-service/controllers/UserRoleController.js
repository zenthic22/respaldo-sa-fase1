const UserRole = require("../models/UserRole");

// Asignar rol a un usuario
exports.assignRole = async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    await UserRole.assign(user_id, role_id);
    res.status(201).json({ message: "Rol asignado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remover rol de un usuario
exports.removeRole = async (req, res) => {
  const { user_id, role_id } = req.query;
  try {
    await UserRole.remove(user_id, role_id);
    res.json({ message: "Rol removido correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener roles de un usuario
exports.getUserRoles = async (req, res) => {
  const { user_id } = req.params;
  try {
    const roles = await UserRole.getRoleByUser(user_id);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};