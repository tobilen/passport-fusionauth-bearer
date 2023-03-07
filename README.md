# passport-fusionauth-bearer

[![GitHub stars](https://img.shields.io/github/stars/tobilen/passport-fusionauth-bearer.svg?style=social&label=Stars)](https://github.com/tobilen/passport-fusionauth-bearer)

> HTTP Bearer authentication strategy for [Passport](http://passportjs.org/) and [FusionAuth](https://www.fusionauth.io/).

This is a fork of the excellent [passport-keycloak-bearer](https://github.com/hgranlund/passport-keycloak-bearer) strategy created and maintained by Simen Haugerud Granlund.

This module lets you authenticate HTTP requests using bearer tokens with a FusionAuth authority in your Node.js
applications. Bearer tokens are typically used protect API endpoints, and are
often issued using OAuth 2.0.

By plugging into Passport, bearer token support can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-fusionauth-bearer

## Usage

FusionauthBearerStrategy uses Bearer Token protocol to protect web resource/api. It works in the following manner:
User sends a request to the protected web api which contains an access_token in either the authorization header or body. Passport extracts and validates the access_token, and propagates the claims in access_token to the `verify` callback and let the framework finish the remaining authentication procedure.

On successful authentication, passport adds the user information to `req.user` and passes it to the next middleware, which is usually the business logic of the web resource/api. In case of error, passport sends back an unauthorized response.

#### Sample usage

```js
import FusionauthBearerStrategy from 'passport-fusionauth-bearer';
// ...
// new FusionauthBearerStrategy(options, verify)
passport.use(
  new FusionauthBearerStrategy(
    ({
      url: 'https://company.fusionauth.io',
    },
    (jwtPayload, done) => {
      const user = doSomethingWithUser(jwtPayload);
      return done(null, user);
    })
  )
);
```

The JWT authentication strategy is constructed as follows:

    new FusionauthBearerStrategy(options, verify)

##### Options

- `url` (Required)

  Fusionauth url. For instance: https://company.fusionauth.io.

- `passReqToCallback` (Optional - Default: false)

  Whether you want to use `req` as the first parameter in the verify callback. See section 5.1.1.3 for more details.

- `loggingLevel` (Optional - Default: 'warn')

  Logging level. 'debug', 'info', 'warn' or 'error'.

- `customLogger` (Optional)

  Custom logging instance. It must be able to log the following types: 'debug', 'info', 'warn' and 'error'.

- `issuer` (Optional)

  If defined the token issuer (iss) will be verified against this
  value.

- `audience` (Optional)

  If defined, the token audience (aud) will be verified against
  this value.

- `algorithms` (Optional - Default: ['HS256'])

  List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].

- `ignoreExpiration` (Optional)

  If true do not validate the expiration of the token.

- `jwtFromRequest` (Optional)

  This value can be set according [passport-jwt](http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request)
  if this options is not used, passport-fusionauth-bearer will obtain jwt from http header Auth as a Bearer token.

- `jsonWebTokenOptions` (Optional)

  passport-fusionauth-bearer is verifying the token using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).
  Pass here an options object for any other option you can pass the jsonwebtoken verifier. (i.e maxAge)

##### Verify callback

`verify` is a function with the parameters `verify(jwtPayload, done)`

- `jwtPayload` is an object literal containing the decoded JWT payload.
- `done` is a passport error first callback accepting arguments
  done(error, user, info)

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'fusionauth'` strategy, to
authenticate requests. Requests containing bearer verified do not require session support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get(
  '/path',
  passport.authenticate('fusionauth', { session: false }),
  function (req, res) {
    res.json(req.user);
  }
);
```

## Support

Submit an [issue](https://github.com/tobilen/passport-fusionauth-bearer/issues/new)

## Contribute

[Contribute](https://github.com/tobilen/passport-fusionauth-bearer/blob/master/CONTRIBUTING.md) usage docs

## License

[MIT License](https://github.com/tobilen/passport-fusionauth-bearer/blob/master/LICENSE)

## Credits

- [Simen Haugerud Granlund](https://hgranlund.com) - Original author this repository is forked from
