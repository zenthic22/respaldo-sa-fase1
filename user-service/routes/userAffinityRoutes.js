const express = require('express');
const router = express.Router();
const UserAffinityController = require('../controllers/UserAffinityController');

router.get("/user/:user_id", UserAffinityController.getAffinitiesByUser);
router.post("/", UserAffinityController.addAffinity);
router.delete("/user/:user_id/category/:category_code", UserAffinityController.removeAffinity);

module.exports = router;