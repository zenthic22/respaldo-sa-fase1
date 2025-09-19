const db = require('../config/db');

class PromotionAssignment {
    constructor(id, promotion_id, user_id, scope, assigned_at) {
        this.id = id;
        this.promotion_id = promotion_id;
        this.user_id = user_id;
        this.scope = scope;
        this.assigned_at = assigned_at;
    }

    static async create(promotion_id, user_id, scope = "ACCOUNT") {
        const [result] = await db.query(
            "INSERT INTO promotion_assignments (promotion_id, user_id, scope) VALUES (?, ?, ?)",
            [promotion_id, user_id, scope]
        );
        return result.insertId;
    }

    static async getByUser(user_id) {
        const [rows] = await db.query("SELECT * FROM promotion_assignments WHERE user_id = ?", [user_id]);
        return rows.map(r => new PromotionAssignment(...Object.values(r)));
    }

    static async getDetailsByUser(user_id) {
        const [rows] = await db.query(`
            SELECT pa.id AS assignment_id,
                   pa.scope,
                   pa.assigned_at,
                   p.id AS promotion_id,
                   p.name,
                   p.type,
                   p.value,
                   p.start_at,
                   p.end_at,
                   p.active
            FROM promotion_assignments pa
            INNER JOIN promotions p ON pa.promotion_id = p.id
            WHERE pa.user_id = ?
        `, [user_id]);

        return rows;
    }

    static async getActivePromotionsByUser(user_id) {
        const [rows] = await db.query(`
            SELECT pa.id AS assignment_id,
                pa.scope,
                pa.assigned_at,
                p.id AS promotion_id,
                p.name,
                p.type,
                p.value,
                p.start_at,
                p.end_at,
                p.active
            FROM promotion_assignments pa
            INNER JOIN promotions p ON pa.promotion_id = p.id
            WHERE pa.user_id = ?
            AND p.active = 1
            AND NOW() BETWEEN p.start_at AND p.end_at
        `, [user_id]);

        return rows;
    }

    static async getBestActivePromotionByUser(user_id) {
        const [rows] = await db.query(`
            SELECT pa.id AS assignment_id,
                pa.scope,
                pa.assigned_at,
                p.id AS promotion_id,
                p.name,
                p.type,
                p.value,
                p.start_at,
                p.end_at,
                p.active
            FROM promotion_assignments pa
            INNER JOIN promotions p ON pa.promotion_id = p.id
            WHERE pa.user_id = ?
            AND p.active = 1
            AND NOW() BETWEEN p.start_at AND p.end_at
            ORDER BY p.value DESC
            LIMIT 1
        `, [user_id]);

        return rows.length ? rows[0] : null;
    }
}

module.exports = PromotionAssignment;