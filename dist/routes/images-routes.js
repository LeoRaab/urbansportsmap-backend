"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_upload_1 = require("../middleware/file-upload");
const imagesController = require("../controllers/images-controller");
const auth_1 = require("../middleware/auth");
const check_upload_path_1 = require("../middleware/check-upload-path");
const resize_images_1 = require("../middleware/resize-images");
const router = (0, express_1.Router)();
router.get('/venue/:venueId', imagesController.getImagesByVenue);
router.use(auth_1.default);
router.get('/user', imagesController.getImagesByUser);
router.get('/venue/:venueId/user', imagesController.getImagesByVenueAndUser);
router.post('/:venueId', check_upload_path_1.default, file_upload_1.default.array('images'), resize_images_1.default, imagesController.uploadImage);
router.delete('/:imageId', imagesController.deleteImage);
exports.default = router;
//# sourceMappingURL=images-routes.js.map