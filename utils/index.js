const bcrypt = require('bcryptjs');

const isPasswordCorrect = (passwordText, passwordHash) => {
  return new Promise((resolve) => bcrypt.compare(
    passwordText, passwordHash, (error, matches) => resolve(matches),
  ));
};

module.exports = {
  isPasswordCorrect,
};
