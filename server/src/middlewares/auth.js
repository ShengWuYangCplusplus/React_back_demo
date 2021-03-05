var jwt = require('../util/jwt.js')
var _ = require('lodash')
const { path_role_arr } = require('../util/jwtConfig.js')

module.exports = (opts) => {
  if (!opts || !opts.anonymouns || !Array.isArray(opts.anonymouns)) {
    opts = {
      anonymouns: [{
        path: '/token',
        method: '*'
      }, {
        path: '/static',
        method: 'GET'
      }]
    }
  }
  return (req, res, next) => {
    var path = req.path
    var method = req.method
    var token = req.get('authorization')
    var user = null
    if (token) {
      token = token.replace('bearer ', '').replace('Bearer ', '')
      user = jwt.decode(token)
      if (user) {
        req.user = user
      }
    }
    var anonymouns = _.find(opts.anonymouns, (o) => path.indexOf(o.path) === 0 && (o.method === method || o.method === '*'))
    if (anonymouns) {
      next()
    } else {
      if (user) {
        let end = path_role_arr.filter(item => item.path === path)
        if (end.length === 1) {
          if (end[0].roles.indexOf(user.roleId) != -1) {
            next()
          } else {
            res.status(401)
            res.json({ status: 401, message: 'unauthorized request???' })
          }
        } else {
          res.status(404)
          res.json({ status: 404, message: 'Not Found' })
        }
      } else {
        res.status(401)
        res.json({ status: 401, message: 'unauthorized request???' })
      }
    }
  }
}