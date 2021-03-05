var fs = require('fs')
var path = require('path')
var express = require('express')
var router = express.Router()
function processDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log('loading routers error', err)
      return
    }
    if (files && files.length) {
      files.forEach((file) => {
        var fullPath = path.join(dir, file)
        var fileStat = fs.statSync(fullPath)
        if (fileStat.isDirectory()) {
          processDir(fullPath)
        } else {
          if (file !== 'index.js') {
            var relativePath = path.relative(__dirname, fullPath)
            var routePath = relativePath.toLowerCase().replace('.js', '')
            routePath = routePath.replace(/\\/g, '/') //兼容windows server
            router.use('/' + routePath, require(fullPath))
          }
        }
      })
    }
  })
}
processDir(__dirname)
module.exports = router