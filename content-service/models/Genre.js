const db = require('../config/db');

class Genre {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Obtener todos los géneros
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM genres");
        return rows.map(row => new Genre(row.id, row.name, row.description));
    }

    // Crear un nuevo género
    static async create(name, description) {
        const [result] = await db.query("INSERT INTO genres (name, description) VALUES (?, ?)", [name, description]);
        return result.insertId;
    }

    // Obtener género por ID
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM genres WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Genre(row.id, row.name, row.created_at, row.updated_at);
    }

    // Actualizar género
    static async update(id, data) {
        const [result] = await db.query(
            `UPDATE genres SET name=?, description=? WHERE id=?`,
            [data.name, data.description, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar género
    static async delete(id) {
        const [result] = await db.query("DELETE FROM genres WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Genre;