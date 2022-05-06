import {Router} from 'express';
import * as commentsController from '../controllers/comments-controller';
import {check} from 'express-validator';

const router = Router();

router.get('/venue/:venueId', commentsController.getCommentsByVenueId);

router.get('/user/:userId', commentsController.getCommentsByUserId);

router.post('/',
    [
        check('comment').not().isEmpty(),
        check('venue').isMongoId(),
        check('author').isMongoId(),
    ], commentsController.createComment);

router.patch('/', commentsController.updateComment);

router.delete('/:commentId', check('author').isMongoId(), commentsController.deleteComment);

export default router;