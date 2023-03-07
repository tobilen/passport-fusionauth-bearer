const axios = require('axios');
const rsaPublicKeyPem = require('./rsaPemDecoder');
const Token = require('./token');

class OIDCMatadata {
  constructor(url, log ) {
    this.log = log || console;
    this.url = url;
    this.discoveryUrl = `${url}/.well-known/openid-configuration`;
    this.getPemKeys().catch((err) => {
      this.log.warn(err.message);
    });
  }

  getKeysFromResponse(body) {
    const rsaKeys = body.keys && body.keys.filter((key) => key.kty === "RSA");
    if (!rsaKeys || rsaKeys.length === 0) {
      throw new Error('We got no AAD signing Keys');
    }
    return rsaKeys.map((key) => ({
      ...key,
      pemKey: rsaPublicKeyPem(key.n, key.e),
    }));
  }

  async getJwksUri() {
    try {
      const res = await axios.get(this.discoveryUrl);
      const discoverUrls = res.data;
      if (!discoverUrls.jwks_uri) {
        throw new Error(
          `Unable to get OIDC metadata from ${this.discoveryUrl}`
        );
      }
      return discoverUrls.jwks_uri;
    } catch (error) {
      throw new Error(
        `Unable to get OIDC metadata from ${this.discoveryUrl}: ${error.message}`
      );
    }
  }

  async getPemKeys() {
    if (Array.isArray(this.keys) && this.keys.length > 0) {
      return this.keys;
    }
    const jwksUri = await this.getJwksUri();
    try {
      const response = await axios.get(jwksUri);
      this.keys = this.getKeysFromResponse(response.data);
      return this.keys;
    } catch (error) {
      const errorMsg = `Cannot get AAD signing Keys from url ${jwksUri}. We got a ${error.message}`;
      throw new Error(errorMsg);
    }
  }

  async pemKeyFromToken(rawToken) {
    const token = new Token(rawToken);
    if (token.isExpired()) {
      this.log.info('The access token has expired');
    }
    this.log.debug(`Got token with kid: ${token.header.kid}`);

    const keys = await this.getPemKeys();
    const keyForToken = keys.find((key) => key.kid === token.header.kid);
    if (!keyForToken) throw Error(`No key matching kid ${token.header.kid}`);

    return keyForToken.pemKey;
  }
}

module.exports = OIDCMatadata;
