"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usersController = require("../controllers/users-controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/login', [
    (0, express_validator_1.check)('email').normalizeEmail().isEmail(),
    (0, express_validator_1.check)('password').isLength({ min: 10 })
], usersController.login);
router.post('/signup', [
    (0, express_validator_1.check)('email').normalizeEmail().isEmail(),
    (0, express_validator_1.check)('password').isLength({ min: 10 }),
    (0, express_validator_1.check)('name').isLength({ min: 3, max: 25 })
], usersController.signup);
router.get('/verify/:verifyString', usersController.verify);
router.use(auth_1.default);
router.get('/:userId', usersController.getUserById);
exports.default = router;
//# sourceMappingURL=users-routes.js.map