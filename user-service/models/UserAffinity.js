const db = require('../config/db');

class UserAffinity {
    constructor(user_id, category_code, added_at) {
        this.user_id = user_id;
        this.category_code = category_code;
        this.added_at = added_at;
    }

    static async create(user_id, category_code) {
        const [result] = await db.query("INSERT INTO user_affinities (user_id, category_code) VALUES (?, ?)", [user_id, category_code]);
        return new UserAffinity(user_id, category_code, new Date());
    }

    static async getByUser(user_id) {
        const [rows] = await db.query("SELECT * FROM user_affinities WHERE user_id = ?", [user_id]);
        return rows.map(r => new UserAffinity(r.user_id, r.category_code, r.added_at));
    }

    static async delete(user_id, category_code) {
        await db.query("DELETE FROM user_affinities WHERE user_id = ? AND category_code = ?", [user_id, category_code]);
    }
}

module.exports = UserAffinity;