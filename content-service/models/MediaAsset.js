const db = require('../config/db');

class MediaAsset {
  constructor(id, content_id, type, url) {
    this.id = id;
    this.content_id = content_id;
    this.type = type;
    this.url = url;
  }

  static async getByContent(content_id) {
    const [rows] = await db.query("SELECT * FROM media_assets WHERE content_id = ?", [content_id]);
    return rows.map(row => new MediaAsset(row.id, row.content_id, row.type, row.url));
  }

  static async create(content_id, type, url) {
    const [result] = await db.query(
      "INSERT INTO media_assets (content_id, type, url) VALUES (?, ?, ?)",
      [content_id, type, url]
    );
    return result.insertId;
  }

  static async update(id, type, url) {
    const [result] = await db.query(
      "UPDATE media_assets SET type=?, url=? WHERE id=?",
      [type, url, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM media_assets WHERE id=?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = MediaAsset;