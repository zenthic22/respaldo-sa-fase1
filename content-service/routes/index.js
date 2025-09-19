const express = require("express");
const router = express.Router();

// Importar rutas
const contentRoutes = require("./contentRoutes");
const genreRoutes = require("./genreRoutes");
const mediaAssetRoutes = require("./mediaAssetRoutes");
const planVisibilityRoutes = require("./planVisibilityRoutes");
const profileFavoriteRoutes = require("./profileFavoriteRoutes");
const profileRecentViewRoutes = require("./profileRecentViewRoutes");
const profileWatchAgainRoutes = require("./profileWatchAgainRoutes");
const profileWatchLaterRoutes = require("./profileWatchLaterRoutes");
const availabilityRoutes = require("./availabilityRoutes");

// Prefijos
router.use("/contents", contentRoutes);
router.use("/genres", genreRoutes);
router.use("/media-assets", mediaAssetRoutes);
router.use("/plan-visibility", planVisibilityRoutes);
router.use("/favorites", profileFavoriteRoutes);
router.use("/recent-views", profileRecentViewRoutes);
router.use("/watch-again", profileWatchAgainRoutes);
router.use("/watch-later", profileWatchLaterRoutes);
router.use("/availability", availabilityRoutes);

module.exports = router;