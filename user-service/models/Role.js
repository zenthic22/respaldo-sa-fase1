const db = require('../config/db');

class Role {
    constructor(id, name, description, created_at) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
    }

    // obtener todos los roles
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM roles");
        return rows.map((row) => new Role(row.id, row.name, row.description, row.created_at));
    }

    // crear un rol
    static async create(name, description) {
        const [result] = await db.query("INSERT INTO roles (name, description) VALUES (?, ?)", [name, description]);
        return result.insertId;
    }

    // buscar rol por ID
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Role(row.id, row.name, row.description, row.created_at);
    }

    // buscar rol por nombre
    static async getByName(name) {
        const [rows] = await db.query("SELECT * FROM roles WHERE name = ?", [name]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Role(row.id, row.name, row.description, row.created_at);
    }

    // actualizar rol
    static async update(id, name, description) {
        const [result] = await db.query("UPDATE roles SET name = ?, description = ? WHERE id = ?", [name, description, id]);
        return result.affectedRows > 0;
    }

    // eliminar rol
    static async delete(id) {
        const [result] = await db.query("DELETE FROM roles WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Role;