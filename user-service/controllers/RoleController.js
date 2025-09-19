const Role = require("../models/Role");

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un rol por ID
exports.getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.getById(id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo rol
exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const roleId = await Role.create(name, description);
    res.status(201).json({ message: "Rol creado exitosamente", id: roleId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un rol
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await Role.delete(id);
    res.json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un rol
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await Role.update(id, name, description);
    res.json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};