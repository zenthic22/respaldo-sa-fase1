const { UserReport, ReportAction } = require("../models");

// Obtener reportes de usuario
exports.getReportsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const reports = await UserReport.getByUser(user_id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear reporte
exports.createReport = async (req, res) => {
  const { user_id, reason, detail } = req.body;
  try {
    const reportId = await UserReport.create(user_id, reason, detail);
    res.status(201).json({ message: "Reporte creado", id: reportId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar estado de reporte
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await UserReport.updateStatus(id, status);
    res.json({ message: "Reporte actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Acciones sobre reportes
exports.createReportAction = async (req, res) => {
  const { report_id, admin_ref, action, notes } = req.body;
  try {
    const actionId = await ReportAction.create(report_id, admin_ref, action, notes);
    res.status(201).json({ message: "Acción creada", id: actionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};