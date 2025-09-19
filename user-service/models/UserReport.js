const db = require("../config/db");

class UserReport {
  constructor(id, user_id, reason, detail, status, created_at, updated_at) {
    this.id = id;
    this.user_id = user_id;
    this.reason = reason;
    this.detail = detail;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async create(user_id, reason, detail) {
    const [result] = await db.query(
      "INSERT INTO user_reports (user_id, reason, detail) VALUES (?, ?, ?)",
      [user_id, reason, detail]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query("SELECT * FROM user_reports");
    return rows.map(r => new UserReport(...Object.values(r)));
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM user_reports WHERE id = ?", [id]);
    return rows.length ? new UserReport(...Object.values(rows[0])) : null;
  }

  static async getByUser(user_id) {
    const [rows] = await db.query(
        "SELECT * FROM user_reports WHERE user_id = ?",
        [user_id]
    );
    return rows.map(r => new UserReport(...Object.values(r)));
  }

  static async updateStatus(id, status) {
    await db.query("UPDATE user_reports SET status = ? WHERE id = ?", [status, id]);
  }
}

module.exports = UserReport;