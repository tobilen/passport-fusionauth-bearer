/* eslint-disable no-new */
const { expect } = require('chai')
const FusionauthBearerStrategy = require('../src')
const nock = require('nock')
const { oidcMetadata } = require('./testData')

describe('FusionauthBearerStrategy', () => {
  it('should be named fusionauth', () => {
    const options = {
      url: 'http://localhost:8080/auth',
      clientId: 'clientId'
    }
    nock(options.url)
      .get(`/.well-known/openid-configuration`)
      .reply(200, oidcMetadata)
      .persist()

    const strategy = new FusionauthBearerStrategy(options)
    expect(strategy.name).to.equal('fusionauth')
  })

  it('should throw if constructed without options', () => {
    expect(() => {
      new FusionauthBearerStrategy()
    }).to.throw(TypeError, 'FusionauthBearerStrategy: options is required')
  })

  it('should throw if constructed with options without url', () => {
    expect(() => {
      new FusionauthBearerStrategy({ clientId: 'clientId' })
    }).to.throw(TypeError, 'FusionauthBearerStrategy: url cannot be empty')
  })
})
