const chai = require('chai');
const mock = require('mock-require');
const passport = require('chai-passport-strategy');
const { validToken, validPem } = require('../testData');

chai.use(require('chai-passport-strategy'));

mock('jsonwebtoken', {
  verify: (token, secretOrKey, _verifOpts, callback) => {
    if (token === validToken && secretOrKey === validPem) {
      callback(null, { name: 'Simen Granlund' });
    } else {
      callback(new Error('Token is not valid'));
    }
  },
});
chai.use(passport);

// noinspection JSConstantReassignment
global.expect = chai.expect;
