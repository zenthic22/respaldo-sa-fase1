const db = require('../config/db');

class Profile {
    constructor(id, user_id, name, avatar_url, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.avatar_url = avatar_url;
        this.created_at = created_at;
    }

    // obtener todos los perfiles
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM profiles");
        return rows.map((row) => new Profile(row.id, row.user_id, row.name, row.avatar_url, row.created_at));
    }

    // crear un nuevo perfil (maximo 5 por usuario)
    static async create(user_id, name, avatar_url = null ) {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM profiles WHERE user_id = ?", [user_id])
        if (rows[0].total >= 5) {
            throw new Error('El usuario ya tiene el maximo de 5 perfiles')
        }
        const [result] = await db.query("INSERT INTO profiles (user_id, name, avatar_url) VALUES (?, ?, ?)", [user_id, name, avatar_url]);
        return result.insertId;
    }

    // obtener perfiles de un usuario
    static async getByUserId(user_id) {
        const [rows] = await db.query("SELECT * FROM profiles WHERE user_id = ?", [user_id]);
        return rows.map((row) => new Profile(row.id, row.user_id, row.name, row.avatar_url, row.created_at));
    }

    // obtener un perfil por su ID
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM profiles WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Profile(row.id, row.user_id, row.name, row.avatar_url, row.created_at);
    }

    // actualizar perfil
    static async update(id, name, avatar_url) {
        const [result] = await db.query("UPDATE profiles SET name = ?, avatar_url = ? WHERE id = ?", [name, avatar_url, id]);
        return result.affectedRows > 0;
    }

    // eliminar perfil
    static async delete(id) {
        const [result] = await db.query("DELETE FROM profiles WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Profile;