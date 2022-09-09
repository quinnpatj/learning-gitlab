module.exports = () => (req, res, next) => {
  if (typeof req.headers.cookie !== 'string') {
    return next()
  }

  let newCookie = ''
  const pairSplitRegExp = /; */
  const pairs = req.headers.cookie.split(pairSplitRegExp)
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    const equalIdx = pair.indexOf('=')

    if (equalIdx < 0) {
      continue
    }

    const key = pair.substr(0, equalIdx).trim()
    let val = pair.substr(equalIdx + 1, pair.length).trim()

    if (
      key === 'X_NM_CLIENT_CONTEXT' &&
      val &&
      typeof val === 'string' &&
      val.length > 0 &&
      val[0] !== '{'
    ) {
      const remainder = val.length % 4
      if (remainder === 2) {
        val += '=='
      } else if (remainder === 3) {
        val += '='
      }
      val = Buffer.from(val, 'base64').toString('utf8')
    }

    newCookie += key + '=' + val + '; '
  }

  req.headers.cookie = newCookie

  return next()
}
