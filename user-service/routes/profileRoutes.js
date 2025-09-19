const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/ProfileController");

// Perfiles
router.get("/user/:user_id", ProfileController.getProfilesByUser);
router.get("/:id", ProfileController.getProfileById);
router.post("/", ProfileController.createProfile);
router.put("/:id", ProfileController.updateProfile);
router.delete("/:id", ProfileController.deleteProfile);

module.exports = router;