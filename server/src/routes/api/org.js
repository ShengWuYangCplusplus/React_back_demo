var express = require('express')
var router = express.Router()
const { list } = require('../../store/org.js')

router.get('/', getUsers);

function getUsers(req, res, next) {
  list().then(
    users => {
      res.json({ code: 0, des: 'success', data: users, })
    }
  ).catch(
    err => next(err)
  )
}

module.exports = router;