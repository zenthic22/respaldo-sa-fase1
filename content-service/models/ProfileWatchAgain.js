const db = require('../config/db');

class ProfileWatchAgain {
  constructor(id, profile_id, content_id, added_at) {
    this.id = id;
    this.profile_id = profile_id;
    this.content_id = content_id;
    this.added_at = added_at;
  }

  static async getByProfile(profile_id) {
    const [rows] = await db.query("SELECT * FROM profile_watch_again WHERE profile_id = ?", [profile_id]);
    return rows.map(row => new ProfileWatchAgain(row.id, row.profile_id, row.content_id, row.added_at));
  }

  static async add(profile_id, content_id) {
    const [result] = await db.query(
      "INSERT INTO profile_watch_again (profile_id, content_id) VALUES (?, ?)",
      [profile_id, content_id]
    );
    return result.insertId;
  }

  static async remove(profile_id, content_id) {
    const [result] = await db.query(
      "DELETE FROM profile_watch_again WHERE profile_id = ? AND content_id = ?",
      [profile_id, content_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ProfileWatchAgain;