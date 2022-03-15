import { hash } from 'bcrypt';
import * as express from 'express';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import passport = require('passport');
import UserModel from '../models/User';
const router = express.Router();

const checkAuthenticated = (req: express.Request, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
const checkNotAuthenticated = (
  req: express.Request,
  res: express.Response,
  next
) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};

router.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { name: (req.user as { name: string })?.name });
});

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('register');
});

router.delete('/logout', (req, res) => {
  res.redirect('/');
});
router.post('/signup', checkNotAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new UserModel({
      name,
      email,
      password,
    });
    user.save();
    res.redirect('/login');
  } catch (e) {
    res.redirect('/signup');
  }
});
router.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
router.post('/token/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !password) {
    return res.json({
      success: false,
      message: 'User not exit',
    });
  }
  const isValid = await user.isValidPassword(password);
  if (!isValid) {
    return res.json({
      success: false,
      message: 'Password is Incorrect',
    });
  }

  const token = sign({ id: user._id }, 'your_jwt_secret');
  res.json({ success: true, token });
});
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'You are autherized persone' });
  }
);
export default router;
