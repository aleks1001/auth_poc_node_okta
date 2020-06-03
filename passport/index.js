const samlStrategy = require('./saml');
const localStrategy = require('./local');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, {
      id: user.id,
      userId: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      imageURL: user.image_url,
      originalUser: user.originalUser,
    });
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  localStrategy(passport);
  samlStrategy(passport);
};
