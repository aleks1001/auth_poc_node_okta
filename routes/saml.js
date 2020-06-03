const express = require('express');
const router = express.Router();
const db = require('../db');

module.exports = (passport) => {

  const url = 'http://localhost:3000/feature'

  router.post('/auth',
    passport.authenticate('saml',
      {
        successRedirect: '/',
        failureRedirect: '/login',
      }),
  );

  router.post('/acs',
    passport.authenticate('saml',
      {
        failureRedirect: '/',
        failureFlash: true,
      }),
    function (req, res) {
      res.redirect(url);
    },
  );
  return router;
};
