const { passport, expect } = require('chai');
const nock = require('nock');
const FusionauthBearerStrategy = require('../src');
const { validToken, jwksResponse, oidcMetadata } = require('./testData');
const options = {
  url: 'http://localhost:8080',
  clientId: 'clientId',
};
let strategy;
describe('FusionauthBearerStrategy', () => {
  before(() => {
    nock(options.url)
      .get(`/.well-known/openid-configuration`)
      .reply(200, oidcMetadata)
      .persist()
      .get(`/oauth2/certs`)
      .reply(200, jwksResponse)
      .persist();

    strategy = new FusionauthBearerStrategy(options, (verifiedToken, done) => {
      if (verifiedToken) {
        return done(null, verifiedToken, { scope: 'read' });
      }
      return done(null, false);
    });
  });

  describe('handling a request with valid token in header', () => {
    let user;
    let info;

    before((done) => {
      passport
        .use(strategy)
        .success((u, i) => {
          user = u;
          info = i;
          done();
        })
        .req((req) => {
          req.headers.authorization = `Bearer ${validToken}`;
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.name).to.equal('Simen Granlund');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });
  });
});
