import { Router } from 'express';
import * as commentsController from '../controllers/comments-controller';
import { check } from 'express-validator';
import auth from '../middleware/auth';

const router = Router();

router.get('/venue/:venueId', commentsController.getCommentsByVenueId);

router.use(auth);

router.get('/user/', commentsController.getCommentsByUserId);

router.post('/:venueId', check('comment').isLength({ min: 3 }), commentsController.createComment);

router.patch('/:commentId', commentsController.updateComment);

router.delete('/:commentId', check('author').isMongoId(), commentsController.deleteComment);

export default router;
