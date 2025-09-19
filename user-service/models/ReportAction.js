const db = require("../config/db");

class ReportAction {
  constructor(id, report_id, admin_ref, action, notes, created_at) {
    this.id = id;
    this.report_id = report_id;
    this.admin_ref = admin_ref;
    this.action = action;
    this.notes = notes;
    this.created_at = created_at;
  }

  static async create(report_id, admin_ref, action, notes) {
    const [result] = await db.query(
      "INSERT INTO report_actions (report_id, admin_ref, action, notes) VALUES (?, ?, ?, ?)",
      [report_id, admin_ref, action, notes]
    );
    return result.insertId;
  }

  static async getByReport(report_id) {
    const [rows] = await db.query("SELECT * FROM report_actions WHERE report_id = ?", [report_id]);
    return rows.map(r => new ReportAction(...Object.values(r)));
  }
}

module.exports = ReportAction;