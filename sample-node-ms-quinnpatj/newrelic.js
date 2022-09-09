const config = require('config')
const newrelicConfig = require('@nm/newrelic-config')
const overrides = {
    license_key:  config.NEW_RELIC_KEY
}
exports.config = newrelicConfig.configs(config.APP_NAME, overrides)
