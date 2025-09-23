const { User, Role, UserRole } = require("../models");

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await User.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    department,
    city,
    address,
    birthdate,
    sex,
    avatar_url,
    subscription_type,
    role
  } = req.body;

  try {
    // Crear usuario en la base de datos
    const nuevoUsuarioId = await User.create({
      username,
      password,
      first_name,
      last_name,
      email,
      phone,
      department,
      city,
      address,
      birthdate,
      sex,
      avatar_url,
      subscription_type
    });

    // Buscar el rol, por defecto "USER"
    const rol = await Role.getByName(role || "USER");
    if (rol) {
      await UserRole.assign(nuevoUsuarioId, rol.id);
    }

    res
      .status(201)
      .json({ message: "Usuario creado", id: nuevoUsuarioId, rol: rol?.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await User.update(id, data);
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await User.getByCorreo(email);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const roles = await UserRole.getRoleByUser(usuario.id);

    res.json({
      id: usuario.id,
      email: usuario.email,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      role: roles?.[0]?.name || "USER"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await User.delete(id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.getById(id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuario por correo
exports.findByCorreo = async (req, res) => {
  const { correo_electronico } = req.params;
  try {
    const correo = await User.getByCorreo(correo_electronico);
    if (!correo)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(correo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};