const fs = require('fs');
const SamlStrategy = require('passport-saml').Strategy;
const { connection } = require('../db');
const { GET_USER_BY_EMAIL } = require('../db/queries');

const config = {
  strategy: 'saml',
  saml: {
    path: '/saml/acs',
    entryPoint: 'https://dev-250162.okta.com/app/1983dev250162_kremlinsaml_1/exkalp2dmli2yiRs74x6/sso/saml',
    issuer: 'http://www.okta.com/exkalp2dmli2yiRs74x6',
    privateCert: fs.readFileSync('./certs/key.pem', 'utf-8'),
    cert: 'MIIDpDCCAoygAwIBAgIGAXFXC2H6MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\n' +
      'A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU\n' +
      'MBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi0yNTAxNjIxHDAaBgkqhkiG9w0BCQEW\n' +
      'DWluZm9Ab2t0YS5jb20wHhcNMjAwNDA3MjM0NzE1WhcNMzAwNDA3MjM0ODE1WjCBkjELMAkGA1UE\n' +
      'BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNV\n' +
      'BAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtMjUwMTYyMRwwGgYJ\n' +
      'KoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n' +
      'pljG0tY1JAJkDW6kx6gXzFYMx+F9CsPTAs/6k49dkr5e0D7yo0cN818Vq4ptfigHwJIE+SZZYVzu\n' +
      '94KZouXC1m+pjKCzLgZNEB2F9xRNRaNuA0NFAD3OI972MIfHezCGGJrR5OIAlglEOA0qvkLgYkx7\n' +
      'KGMR52Q6TqNboU+4ZWEvhJ92MeKNMej7bNwCSTfnFD5gZ2AfIrPHUx8DFBD2Ln7dupe8f5O8hshI\n' +
      '9eYWu1G2gE7R3CkGy933BcoMboYSNgHaoOmfT5LJQNilD9oAosRi8nQ8/H+35SpMxxry0m33A9zv\n' +
      '8/NCEjCjt86ZfUDTisa8K/bU1v5WNMgbFafDbQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQADNTAO\n' +
      '+vFkr8JydwPD5dyzrB2P58r6cZgZRbyby7I4onH3+UspQ4uy3LAw6f29khcYfGY4I5l539neCuuk\n' +
      'jJOc7Xh3RHLLgWiQ0OAeKGikDJYP7nyJnwNwcWvc4/2UTyrpPcx9yRtKA14Qu2J0kfrZGSdklhSr\n' +
      'MzgP7uqH7Uq6OTLLAesnJ2JnIQ0UswD33bKfHak+bdd4SvLgH+pxlrUWJNHYZpJ9QcF9iWmIvsdj\n' +
      'sptN5oYPIBmrPN+H1oxOtVjw0Obtb6ij5AYVgcrNA3CmC3jJgPaQMEKNujwAeocCeiijA4uJ/2ho\n' +
      'fCv+XH9T+BTwvgBIpEJIl51dR+9oGhjS',
  },
};

module.exports = (passport) => {
  passport.use(new SamlStrategy(
    {
      path: config.saml.path,
      entryPoint: config.saml.entryPoint,
      issuer: config.saml.issuer,
      cert: config.saml.cert,
      privateCert: config.saml.privateCert,
    },
    (profile, done) => {
      connection.query(GET_USER_BY_EMAIL, [profile.nameID], async (error, results) => {
        if (error) {
          return done(error);
        }
        if (results.length > 0) {
          return done(null, results[0]);
        }
        return done(null, false, { message: 'Incorrect username.' });
      });
    }),
  );
};
