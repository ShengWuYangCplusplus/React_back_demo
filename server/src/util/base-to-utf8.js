module.exports = (req) => {
  var utfStr = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8'); // Ta-da
  return {
    account: utfStr.split(':')[0],
    password: utfStr.split(':')[1],
  }
}