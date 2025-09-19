const db = require('../config/db');

class PlanVisibility {
  constructor(id, content_id, plan) {
    this.id = id;
    this.content_id = content_id;
    this.plan = plan;
  }

  static async getByContent(content_id) {
    const [rows] = await db.query("SELECT * FROM plan_visibility WHERE content_id = ?", [content_id]);
    return rows.map(row => new PlanVisibility(row.id, row.content_id, row.plan));
  }

  static async create(content_id, plan) {
    const [result] = await db.query(
      "INSERT INTO plan_visibility (content_id, plan) VALUES (?, ?)",
      [content_id, plan]
    );
    return result.insertId;
  }

  static async update(id, plan) {
    const [result] = await db.query(
        "UPDATE plan_visibility SET plan = ? WHERE id = ?",
        [plan, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
        "DELETE FROM plan_visibility WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = PlanVisibility;