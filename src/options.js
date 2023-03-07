const { createLogManager } = require('simple-node-logger')

const verifyOptions = options => {
  if (!options || typeof options !== 'object') {
    throw new TypeError('FusionauthBearerStrategy: options is required')
  }
  if (!options.url || options.url === '') {
    throw new TypeError('FusionauthBearerStrategy: url cannot be empty')
  }
  if (options.customLogger) {
    if (typeof options.customLogger.error !== 'function') {
      throw new TypeError(
        'FusionauthBearerStrategy: customLogger must have a error function'
      )
    }
    if (typeof options.customLogger.warn !== 'function') {
      throw new TypeError(
        'FusionauthBearerStrategy: customLogger must have a warn function'
      )
    }
    if (typeof options.customLogger.info !== 'function') {
      throw new TypeError(
        'FusionauthBearerStrategy: customLogger must have a info function'
      )
    }
    if (typeof options.customLogger.debug !== 'function') {
      throw new TypeError(
        'FusionauthBearerStrategy: customLogger must have a debug function'
      )
    }
  }
}

const getLogger = options => {
  if (options.customLogger) {
    console.log("creating custom logger")
    return options.customLogger
  }

  const log = createLogManager().createLogger('FusionauthBearerStrategy -')
  log.setLevel(options.loggingLevel || 'warn')
  return log
}

const setDefaults = options => ({
  ...options,
  name: options.name || 'fusionauth',
  log: getLogger(options)
})

module.exports = { verifyOptions, setDefaults }
