module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.log(err)
  if (typeof (err) === 'string') {
    return res.status(400).json({ code: 1, message: err, des: 'failed' })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ code: 1, message: "Invalid Token", des: 'failed' })
  }

  return res.status(500).json({ code: 1, message: err.message, des: 'failed' })
}