const insureRedirectURI = (req, res, next) => {
  const redirect_uri = req.query.redirect_uri;
  if (!redirect_uri) {
    return next(new Error('No redirect URI provided!'));
  }
  next();
};

const insureReferer = (req, res, next) => {
  const referer = req.headers.referer;
  if (!referer) {
    return next(new Error('Not a browser call! Missing headers.'))
  }
  next();
}

module.exports = {
  insureRedirectURI,
  insureReferer,
};
