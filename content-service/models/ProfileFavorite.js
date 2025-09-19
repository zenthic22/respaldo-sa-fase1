const db = require('../config/db');

class ProfileFavorite {
    constructor(id, profile_id, content_id, added_at) {
        this.id = id;
        this.profile_id = profile_id;
        this.content_id = content_id;
        this.added_at = added_at;
    }

    static async getByProfile(profile_id) {
        const [rows] = await db.query(
            "SELECT * FROM profile_favorites WHERE profile_id = ?",
            [profile_id]
        );
        return rows.map(r => new ProfileFavorite(r.id, r.profile_id, r.content_id, r.added_at));
    }

    static async add(profile_id, content_id) {
        const [result] = await db.query(
            "INSERT INTO profile_favorites (profile_id, content_id) VALUES (?, ?)",
            [profile_id, content_id]
        );
        return result.insertId;
    }

    static async remove(profile_id, content_id) {
        const [result] = await db.query(
            "DELETE FROM profile_favorites WHERE profile_id = ? AND content_id = ?",
            [profile_id, content_id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ProfileFavorite;