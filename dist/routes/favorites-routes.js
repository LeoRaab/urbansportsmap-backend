"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritesController = require("../controllers/favorites-controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get('/', favoritesController.getFavorites);
router.post('/:venueId', favoritesController.createFavorite);
router.delete('/:venueId', favoritesController.deleteFavorite);
exports.default = router;
//# sourceMappingURL=favorites-routes.js.map