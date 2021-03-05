var jwt = require('jsonwebtoken')

var { jwtSecret, jwtOptions } = require('./jwtConfig.js')
module.exports = {
  sign: (payload) => {
    // payload.expiresIn = jwtExpireIn
    return jwt.sign(payload, jwtSecret, jwtOptions)
  },
  decode: (token) => {
    try {
      return jwt.verify(token, jwtSecret, jwtOptions)
    }
    catch {
      return null
    }
  }
}