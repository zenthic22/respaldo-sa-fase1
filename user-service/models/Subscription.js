const db = require('../config/db');

class Subscription {
    constructor(id, user_id, plan_code, start_date, end_date, status, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.plan_code = plan_code;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.created_at = created_at;
    }

    static async create(user_id, plan_code, start_date, end_date) {
        const [result] = await db.query(
            "INSERT INTO subscriptions (user_id, plan_code, start_date, end_date) VALUES (?, ?, ?, ?)",
            [user_id, plan_code, start_date, end_date]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM subscriptions WHERE id = ?", [id]);
        return rows.length ? new Subscription(...Object.values(rows[0])) : null;
    }

    static async getByUser(user_id) {
        const [rows] = await db.query("SELECT * FROM subscriptions WHERE user_id = ?", [user_id]);
        return rows.map(r => new Subscription(...Object.values(r)));
    }

    static async update(id, plan_code, start_date, end_date, status) {
        await db.query("UPDATE subscriptions SET plan_code = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?", [plan_code, start_date, end_date, status, id]);
    }

    static async deleteById(id) {
        const [result] = await db.query("DELETE FROM subscriptions WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }

    static async cancel(id) {
        await db.query("UPDATE subscriptions SET status = 'CANCELLED' WHERE id = ?", [id]);
    }

    static async activate(id) {
        await db.query("UPDATE subscriptions SET status = 'ACTIVE' WHERE id = ?", [id]);
    }

    static async expire(id) {
        await db.query("UPDATE subscriptions SET status = 'EXPIRED' WHERE id = ?", [id]);
    }
}

module.exports = Subscription;