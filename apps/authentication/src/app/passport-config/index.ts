import { Strategy } from 'passport-local';
import { compare } from 'bcrypt';
export default (passport, getUserByEmail, getByUserId) => {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user === null) {
      return done(null, false, { message: 'User does not exits' });
    }
    try {
      if (await compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new Strategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) =>
    done(null, await getByUserId(id))
  );
};
