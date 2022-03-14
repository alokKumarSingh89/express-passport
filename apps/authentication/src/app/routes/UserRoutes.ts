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

router.get('/', checkAuthenticated, (req, res) => {
  // console.log(req.user);
  res.render('index', { name: (req.user as { name: string })?.name });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('register');
});

router.delete('/logout', (req, res) => {
  res.redirect('/');
});
router.post('/signup', async (req, res) => {
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
  passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
export default router;
