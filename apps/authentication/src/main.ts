/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
const app = express();
import * as passport from 'passport';
import flash = require('express-flash');
import * as session from 'express-session';

import db from './app/database';
import UserModel from './app/models/User';
import userRoutes from './app/routes/UserRoutes';
import passportConfig from './app/passport-config';

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
const port = process.env.port || 3333;
app.use(flash());
app.use(
  session({
    secret: 'MySecreate',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

db()
  .then(() => {
    passportConfig(
      passport,
      async (email) => {
        const user = await UserModel.findOne({ email });
        return user;
      },
      async (id) => {
        const user = await UserModel.findById({ _id: id });
        return user;
      }
    );
    app.use('/', userRoutes);
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  })
  .catch((err) => console.log(err.reason));
