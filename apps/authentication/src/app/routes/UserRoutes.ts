import { hash } from 'bcrypt';
import * as express from 'express';
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
    const hasspassword = await hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hasspassword,
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
export default router;
