"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venuesController = require("../controllers/venues-controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', venuesController.getVenues);
router.get('/:venueId', venuesController.getVenueById);
router.use(auth_1.default);
exports.default = router;
//# sourceMappingURL=venues-routes.js.map