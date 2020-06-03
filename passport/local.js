const LocalStrategy = require('passport-local').Strategy;
const { connection } = require('../db');
const { GET_USER_BY_EMAIL } = require('../db/queries');
const { isPasswordCorrect } = require('../utils');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      connection.query(GET_USER_BY_EMAIL, [username], async (error, results) => {
        if (error) {
          return done(error);
        }

        if (results.length > 0) {
          const isMatch = await isPasswordCorrect(password, results[0].password);
          if (isMatch) {
            return done(null, results[0]);
          }
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, false, { message: 'Incorrect username.' });
      });
    }));
};
