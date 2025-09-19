const db = require('../config/db');

class ProfileRecentView {
    constructor(id, profile_id, content_id, viewed_at) {
        this.id = id;
        this.profile_id = profile_id;
        this.content_id = content_id;
        this.viewed_at = viewed_at;
    }

    static async getByProfile(profile_id) {
        const [rows] = await db.query(
            `SELECT * FROM profile_recent_views WHERE profile_id = ? ORDER BY viewed_at DESC`,
            [profile_id]
        );

        return rows.map(r => new ProfileRecentView(r.id, r.profile_id, r.content_id, r.viewed_at));
    }

    static async add(profile_id, content_id) {
        const [result] = await db.query(
            `INSERT INTO profile_recent_views (profile_id, content_id) VALUES (?, ?)`,
            [profile_id, content_id]
        );
        return result.insertId;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM profile_recent_views WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ProfileRecentView;