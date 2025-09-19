const db = require('../config/db');

class AvailabilityWindow {
  constructor(id, content_id, start_date, end_date) {
    this.id = id;
    this.content_id = content_id;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  static async getByContent(content_id) {
    const [rows] = await db.query("SELECT * FROM availability_windows WHERE content_id = ?", [content_id]);
    return rows.map(row => new AvailabilityWindow(row.id, row.content_id, row.start_date, row.end_date));
  }

  static async create(content_id, start_date, end_date) {
    const [result] = await db.query(
      "INSERT INTO availability_windows (content_id, start_date, end_date) VALUES (?, ?, ?)",
      [content_id, start_date, end_date]
    );
    return result.insertId;
  }

  static async update(id, start_date, end_date) {
    const [result] = await db.query(
      "UPDATE availability_windows SET start_date=?, end_date=? WHERE id=?",
      [start_date, end_date, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM availability_windows WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = AvailabilityWindow;