const express = require("express");
const router = express.Router();

// Importar rutas
const contentRoutes = require("./contentRoutes");
const genreRoutes = require("./genreRoutes");
const profileFavoriteRoutes = require("./profileFavoriteRoutes");

// Prefijos
router.use("/contents", contentRoutes);
router.use("/genres", genreRoutes);
router.use("/favorites", profileFavoriteRoutes);

module.exports = router;