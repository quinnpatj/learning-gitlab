const newrelic = require('newrelic')

module.exports = () => (req, res, next) => {
  newrelic.addCustomAttribute(
    'nmUniqueId',
    req.headers['x-nm-nm_uid'] || 'no_user'
  )
  newrelic.addCustomAttribute(
    'employeeType',
    req.headers['x-nm-user-type'] || 'no_user_type'
  )
  if (req.cookies && req.cookies.X_NM_CLIENT_CONTEXT) {
    const parsedCookie = JSON.parse(req.cookies.X_NM_CLIENT_CONTEXT)
    if (parsedCookie.clientNmUniqueId) {
      newrelic.addCustomAttribute(
        'clientNmUniqueId',
        parsedCookie.clientNmUniqueId
      )
    }
    if (parsedCookie.worksForNmUniqueId) {
      newrelic.addCustomAttribute(
        'worksForNmUniqueId',
        parsedCookie.worksForNmUniqueId
      )
    }
    if (parsedCookie.worksForEmployeeType) {
      newrelic.addCustomAttribute(
        'worksForEmployeeType',
        parsedCookie.worksForEmployeeType
      )
    }
  }
  next()
}
