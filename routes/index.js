const express = require('express');
const { insureRedirectURI, insureReferer } = require('./middleware');
const router = express.Router();
const querystring = require('querystring');
const { query } = require('../db');
const { GET_USER_BY_ID } = require('../db/queries');

module.exports = (passport) => {

  router.get('/', insureRedirectURI, (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect(req.query.redirect_uri);
    }

    const error = req.flash();
    const data = {
      ...error,
      title: 'BBI Login',
      redirectURI: encodeURIComponent(req.query.redirect_uri),
    };
    return res.render('index', data);
  });

  router.post('/login', insureRedirectURI, (req, res, next) => {
    const queryString = querystring.encode({
      redirect_uri: req.query.redirect_uri,
    });
    passport.authenticate('local', {
      failureRedirect: `/?${queryString}`,
      successRedirect: req.query.redirect_uri,
    })(req, res, next);
  });

  router.post('/spoof', async (req, res, next) => {
    if (req.isAuthenticated()) {
      try {
        let spoofedUser;
        const user = req.user;
        const spoof = (u) => {
          return req.logIn(u, (err) => {
            if (err) {
              return next(err);
            }
            return res.status(200).end();
          });
        };
        if (user.originalUser) {
          spoofedUser = await query(GET_USER_BY_ID, [user.originalUser]);
          return spoof(spoofedUser[0]);
        } else {
          spoofedUser = await query(GET_USER_BY_ID, [req.body.id]);
          return spoof({ ...spoofedUser[0], originalUser: user.id });
        }
      } catch (e) {
        console.log('ERROR', e);
        return next(e);
      }
    }
    res.status(401).end();
  });

  router.post('/introspect', insureReferer, (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({
        isAuthenticated: true,
        user: req.user,
      });
    }

    const queryString = querystring.encode({
      redirect_uri: req.headers.referer,
    });
    res.json({
      isAuthenticated: false,
      // TODO: get this the right way!
      redirectURI: `http://localhost:8080?${queryString}`,
    });
  });

  router.post('/logout', insureReferer, (req, res) => {
    req.logout();
    res.json({
      isAuthenticated: false,
    });
  });

  return router;
};
