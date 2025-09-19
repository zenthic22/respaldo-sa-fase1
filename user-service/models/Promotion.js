const db = require('../config/db');

class Promotion {
    constructor(id, name, type, value, start_at, end_at, active, created_at) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.start_at = start_at;
        this.end_at = end_at;
        this.active = active;
        this.created_at = created_at;
    }

    static async create(name, type, value, start_at, end_at, active = true) {
        const [result] = await db.query(
        "INSERT INTO promotions (name, type, value, start_at, end_at, active) VALUES (?, ?, ?, ?, ?, ?)",
        [name, type, value, start_at, end_at, active]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query("SELECT * FROM promotions");
        return rows.map(r => new Promotion(...Object.values(r)));
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM promotions WHERE id = ?", [id]);
        return rows.length ? new Promotion(...Object.values(rows[0])) : null;
    }

    static async update(id, name, type, value, start_at, end_at, active) {
        await db.query(
        "UPDATE promotions SET name=?, type=?, value=?, start_at=?, end_at=?, active=? WHERE id=?",
        [name, type, value, start_at, end_at, active, id]
        );
    }

    static async delete(id) {
        await db.query("DELETE FROM promotions WHERE id = ?", [id]);
    }
}

module.exports = Promotion;