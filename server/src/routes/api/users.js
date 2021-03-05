var express = require('express')
var router = express.Router()
const { validate, list, detail, addUser, deleteUser, updateUser } = require('../../store/users/index')

router.get('/', getUsers);
router.get('/detail', getDetail)
router.post('/', addOne)
router.delete('/', deleteOne)
router.put('/', updateOne)

function getUsers(req, res, next) {
  list(req.query).then(
    users => {
      res.json({ code: 0, data: users, des: 'success' })
      return
    }
  ).catch(
    err => next(err)
  )
}


function getDetail(req, res, next) {
  detail(req.query).then(
    result => {
      res.json({ code: 0, data: result, des: 'success' })
    }
  ).catch(
    err => next(err)
  )
}

function addOne(req, res, next) {
  addUser(req.body).then(
    result => {
      if(result==='exist'){
        res.json({
          code:1,
          des:'账号已存在'
        })
      }
      else if (result.result.ok=== 1) {
        res.json({
          code: 0, des: 'success'
        })
      }
    }
  ).catch(
    err => next(err)
  )
}
function deleteOne(req, res, next) {
  deleteUser(req.query).then(
    result => {
      if (result.ok === 1) {
        res.json({
          code: 0, des: 'success'
        })
      }
    }
  ).catch(
    err => next(err)
  )
}
function updateOne(req, res, next) {
  console.log(req.body)
  updateUser({...req.body,_id:req.user.identity}).then(
    result => {
      console.log("result",result)
      if (result.result.ok === 1) {
        res.json({
          code: 0, des: 'success'
        })
      }
    }
  ).catch(
    err => next(err)
  )

}

module.exports = router;