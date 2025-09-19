const express = require("express");
const router = express.Router();
const AvailabilityWindowController = require("../controllers/AvailabilityWindowController");

router.get("/:content_id", AvailabilityWindowController.getAvailabilityByContent);
router.post("/", AvailabilityWindowController.addAvailability);
router.put("/:id", AvailabilityWindowController.updateAvailability);
router.delete("/:id", AvailabilityWindowController.deleteAvailability);

module.exports = router;