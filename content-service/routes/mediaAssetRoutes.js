const express = require("express");
const router = express.Router();
const MediaAssetController = require("../controllers/MediaAssetController");

router.get("/:content_id", MediaAssetController.getMediaAssetsByContent);
router.post("/", MediaAssetController.createMediaAsset);
router.put("/:id", MediaAssetController.updateMedia);
router.delete("/:id", MediaAssetController.deleteMedia);

module.exports = router;