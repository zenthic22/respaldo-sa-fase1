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

    static async _updateUserType(user_id, plan_code, status) {
        let newType = "FREE";
        if (status === "ACTIVE" && plan_code !== "FREE") {
            newType = "PREMIUM";
        }
        await db.query("UPDATE users SET subscription_type = ? WHERE id = ?", [newType, user_id]);
    }

    static _calculateDates(plan_code, start_date = new Date()) {
        const start = new Date(start_date);
        let end = null;

        if (plan_code === "PREMIUM_MONTHLY") {
            end = new Date(start);
            end.setMonth(start.getMonth() + 1);
        } else if (plan_code === "PREMIUM_ANNUAL") {
            end = new Date(start);
            end.setFullYear(start.getFullYear() + 1);
        }

        return {
            start_date: start.toISOString().slice(0, 10),
            end_date: end ? end.toISOString().slice(0, 10) : null
        }
    }

    static async create(user_id, plan_code, start_date = new Date(), end_date = null, status = "ACTIVE") {
        const dates = this._calculateDates(plan_code, start_date);
        
        if (status === "ACTIVE") {
            const [rows] = await db.query(
                "SELECT id FROM subscriptions WHERE user_id = ? AND status = 'ACTIVE'",
                [user_id]
            );

            if (rows.length > 0) {
                const activeSubId = rows[0].id;
                await db.query(
                    "UPDATE subscriptions SET plan_code = ?, start_date = ?, end_date = ? WHERE id = ?",
                    [plan_code, dates.start_date, dates.end_date, activeSubId]
                );

                await this._updateUserType(user_id, plan_code, status);
                return activeSubId;
            }
        }

        const [result] = await db.query(
            "INSERT INTO subscriptions (user_id, plan_code, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)",
            [user_id, plan_code, dates.start_date, dates.end_date, status]
        );

        await this._updateUserType(user_id, plan_code, status);

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

    static async update(id, plan_code = null, start_date = null, end_date = null, status = null) {
        const fields = [];
        const values = [];

        // Si se cambia el plan, recalculamos fechas
        if (plan_code) {
            fields.push("plan_code = ?");
            values.push(plan_code);

            const dates = this._calculateDates(plan_code, start_date || new Date());
            fields.push("start_date = ?", "end_date = ?");
            values.push(dates.start_date, dates.end_date);
        }

        if (status) {
            fields.push("status = ?");
            values.push(status);
        }

        if (fields.length === 0) throw new Error("No hay campos para actualizar");

        values.push(id);
        await db.query(`UPDATE subscriptions SET ${fields.join(", ")} WHERE id = ?`, values);

        const [rows] = await db.query("SELECT user_id, plan_code, status FROM subscriptions WHERE id = ?", [id]);
        if (rows[0]) {
            await this._updateUserType(rows[0].user_id, rows[0].plan_code, rows[0].status);
        }
    }

    static async changeStatus(id, status) {
        const [rows] = await db.query("SELECT user_id, plan_code FROM subscriptions WHERE id = ?", [id]);
        if (!rows[0]) throw new Error("Suscripción no encontrada");

        await db.query("UPDATE subscriptions SET status = ? WHERE id = ?", [status, id]);
        await this._updateUserType(rows[0].user_id, rows[0].plan_code, status);
    }

    static async cancel(id) { return this.changeStatus(id, "CANCELLED"); }
    static async activate(id) { return this.changeStatus(id, "ACTIVE"); }
    static async expire(id) { return this.changeStatus(id, "EXPIRED"); }

    static async deleteById(id) {
        const [rows] = await db.query("SELECT user_id FROM subscriptions WHERE id = ?", [id]);
        const sub = rows[0];

        const [result] = await db.query("DELETE FROM subscriptions WHERE id = ?", [id]);
        
        if (sub) {
            await db.query("UPDATE users SET subscription_type = 'FREE' WHERE id = ?", [sub.user_id]);
        }
        
        return result.affectedRows > 0;
    }
}

module.exports = Subscription;