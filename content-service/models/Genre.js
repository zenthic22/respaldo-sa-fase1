const db = require('../config/db');

class Genre {
    constructor(id, name, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // Obtener todos los géneros
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM genres");
        return rows.map(row => new Genre(row.id, row.name, row.created_at, row.updated_at));
    }

    // Crear un nuevo género
    static async create(name) {
        const [result] = await db.query("INSERT INTO genres (name) VALUES (?)", [name]);
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
            `UPDATE genres SET name=? WHERE id=?`,
            [data.name, id]
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