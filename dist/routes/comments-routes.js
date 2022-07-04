"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentsController = require("../controllers/comments-controller");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/venue/:venueId', commentsController.getCommentsByVenueId);
router.use(auth_1.default);
router.get('/user/', commentsController.getCommentsByUserId);
router.post('/:venueId', (0, express_validator_1.check)('comment').isLength({ min: 3 }), commentsController.createComment);
router.patch('/:commentId', commentsController.updateComment);
router.delete('/:commentId', (0, express_validator_1.check)('author').isMongoId(), commentsController.deleteComment);
exports.default = router;
//# sourceMappingURL=comments-routes.js.map