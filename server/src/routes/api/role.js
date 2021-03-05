var express = require('express')
var router = express.Router()
const { search } = require('../../store/role/index')

router.get('/', searchRole);

function searchRole(req, res, next) {
  search(req.query).then(
    result => {
      res.json({ code: 0, data: result, des: 'success' })
    }
  ).catch(
    err => next(err)
  )
}

module.exports = router;