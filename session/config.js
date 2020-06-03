const sessionConfig = (sessionStore) => ({
  key: 'SESSION_ID',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: true,
  cookie: {
    maxAge: 90000,
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  },
  saveUninitialized: false,
});

module.exports = sessionConfig;
