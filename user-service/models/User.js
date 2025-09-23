const db = require('../config/db');

class User {
    constructor(id, username, password, first_name, last_name, email, phone, department, city, address, birthdate, sex, avatar_url, subscription_type, is_blocked, is_verified, created_at, updated_at) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.city = city;
        this.address = address;
        this.birthdate = birthdate;
        this.sex = sex;
        this.avatar_url = avatar_url;
        this.subscription_type = subscription_type;
        this.is_blocked = is_blocked;
        this.is_verified = is_verified;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // obtener todos los usuarios
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM users");
        return rows.map((row) => new User(row.id, row.username, row.password, row.first_name, row.last_name, row.email, row.phone, row.department, row.city, row.address, row.birthdate, row.sex, row.avatar_url, row.subscription_type, row.is_blocked, row.is_verified, row.created_at, row.updated_at));
    }

    // crear usuario
    static async create(data) {
        const [result] = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, email, phone, department, city, address, birthdate, sex, avatar_url, subscription_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.username, data.password, data.first_name, data.last_name, data.email, data.phone, data.department, data.city, data.address, data.birthdate || null, data.sex || null, data.avatar_url || null, data.subscription_type || "FREE"]
        );
        return result.insertId;
    }

    // buscar usuario por ID
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new User(row.id, row.username, row.password, row.first_name, row.last_name, row.email, row.phone, row.department, row.city, row.address, row.birthdate, row.sex, row.avatar_url, row.subscription_type, row.is_blocked, row.is_verified, row.created_at, row.updated_at)
    }

    // Buscar usuario por correo electrónico
    static async getByCorreo(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return null;
        return rows[0];
    }

    // buscar usuario por username
    static async getByUsername(username) {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) return null;
        return rows[0];
    }

    // actualizar usuario
    static async update(id, data) {
        const fields = [];
        const values = [];

        for (const key in data) {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }

        if (fields.length === 0) return false;

        values.push(id);

        const [result] = await db.query(
            `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    // eliminar usuario
    static async delete(id) {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;