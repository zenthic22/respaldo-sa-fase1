const express = require("express");
const router = express.Router();
const ProfileWatchAgainController = require("../controllers/ProfileWatchAgainController");

router.get("/:profile_id", ProfileWatchAgainController.getWatchAgainByProfile);
router.post("/", ProfileWatchAgainController.addWatchAgain);
router.delete("/:profile_id/:content_id", ProfileWatchAgainController.removeWatchAgain);

module.exports = router;