const { passport, expect } = require('chai');
const nock = require('nock');
const FusionauthBearerStrategy = require('../src');
const { validToken, jwksResponse, oidcMetadata } = require('./testData');

const options = {
  url: 'http://localhost:8080',
  clientId: 'clientId',
};

describe('FusionauthBearerStrategy', () => {
  describe('failing a request in user-callback', () => {
    let challenge;
    const strategy = new FusionauthBearerStrategy(
      options,
      (verifidToken, done) => done(null, false, 'The access token expired')
    );
    before((done) => {
      nock(options.url)
        .get(`/.well-known/openid-configuration`)
        .reply(200, oidcMetadata)
        .persist()
        .get(`/oauth2/certs`)
        .reply(200, jwksResponse);

      passport
        .use(strategy)
        .fail((c) => {
          challenge = c.toString();
          done();
        })
        .req((req) => {
          req.headers.authorization = `Bearer ${validToken}`;
        })
        .authenticate();
    });

    it('should fail with challenge', () => {
      expect(challenge).to.be.a('string');
      expect(challenge).to.equal('The access token expired');
    });
  });

  describe('handling a request with wrong token', () => {
    let challenge;
    const strategy = new FusionauthBearerStrategy(
      options,
      (verifidToken, done) => {
        if (verifidToken) {
          return done(null, verifidToken, { scope: 'read' });
        }
        return done(null, false);
      }
    );
    before((done) => {
      nock(options.url)
        .get(`/.well-known/openid-configuration`)
        .reply(200, oidcMetadata)
        .get(`/oauth2/userinfo`)
        .reply(200);

      passport
        .use(strategy)
        .fail((c) => {
          challenge = c.toString();
          done();
        })
        .req((req) => {
          req.headers.authorization = 'Bearer WRONG';
        })
        .authenticate();
    });

    it('should fail with challenge', () => {
      expect(challenge).to.be.a('string');
      expect(challenge).to.equal('Error: Token is malformed');
    });
  });
});
