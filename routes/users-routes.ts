import { Router } from 'express';
import { check } from 'express-validator';
import * as usersController from '../controllers/users-controller';
import auth from '../middleware/auth';

const router = Router();

router.post(
  '/login',
  [check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 10 })],
  usersController.login,
);

router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 10 }),
    check('name').isLength({ min: 3, max: 25 }),
  ],
  usersController.signup,
);

router.get('/verify/:verifyString', usersController.verify);

router.post('/password/request', [check('email').normalizeEmail().isEmail()], usersController.requestPassword);

router.patch('/password/reset', [check('password').isLength({ min: 10 })], usersController.resetPassword);

router.use(auth);

router.get('/', usersController.getUserById);

router.delete('/', usersController.deleteUser);

export default router;
