const crypto = require('crypto');

module.exports = (secret) => {
  var md5 = crypto.createHash('md5')
  // var key = crypto.scryptSync(secret, 'mysecretword', 64)
  var key = md5.update(secret).digest('hex')
  return key
}