const express = require("express");
const router = express.Router();
const ProfileFavoriteController = require("../controllers/ProfileFavoriteController");

router.get("/:profile_id", ProfileFavoriteController.getFavoritesByProfile);
router.post("/", ProfileFavoriteController.addFavorite);
router.delete("/:profile_id/:content_id", ProfileFavoriteController.removeFavorite);

module.exports = router;