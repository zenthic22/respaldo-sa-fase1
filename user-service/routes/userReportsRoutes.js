const express = require('express');
const router = express.Router();
const UserReportController = require('../controllers/UserReportController');

router.get("/user/:user_id", UserReportController.getReportsByUser);
router.post("/", UserReportController.createReport);
router.put("/:id/status", UserReportController.updateReportStatus);
router.post("/action", UserReportController.createReportAction);

module.exports = router;