import { Router } from 'express';
import { check } from 'express-validator';
import * as usersController from '../controllers/users-controller';
import auth from '../middleware/auth';

const router = Router();

router.post('/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 })
    ], usersController.login);

router.post('/signup',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 }),
        check('name').not().isEmpty()
    ], usersController.signup);

//router.use(auth);

router.get('/:userId', usersController.getUserById);

router.post('/logout', usersController.logout);

export default router;