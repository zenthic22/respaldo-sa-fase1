const express = require("express");
const router = express.Router();
const ProfileRecentViewController = require("../controllers/ProfileRecentViewController");

router.get("/:profile_id", ProfileRecentViewController.getRecentViewsByProfile);
router.post("/", ProfileRecentViewController.addRecentView);
router.delete("/:id", ProfileRecentViewController.deleteRecentView);

module.exports = router;