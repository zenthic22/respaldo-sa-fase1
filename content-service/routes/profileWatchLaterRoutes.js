const express = require("express");
const router = express.Router();
const ProfileWatchLaterController = require("../controllers/ProfileWatchLaterController");

router.get("/:profile_id", ProfileWatchLaterController.getWatchLaterByProfile);
router.post("/", ProfileWatchLaterController.addWatchLater);
router.delete("/:profile_id/:content_id", ProfileWatchLaterController.removeWatchLater);

module.exports = router;