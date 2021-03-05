var express = require('express')
var router = express.Router()
const { search,add ,searchUserNotice} = require('../../store/notice/index')

router.get('/', searchNotice);
router.get('/byUserId', getUserNotice);
router.post('/', addNotice);

function searchNotice(req, res, next) {
  search(req.query).then(
    result => {
      res.json({ code: 0, data: result, des: 'success' })
    }
  ).catch(
    err => next(err)
  )
}
function getUserNotice(req, res, next) {
  searchUserNotice(req.query).then(
    result => {
      res.json({ code: 0, data: result, des: 'success' })
    }
  ).catch(
    err => next(err)
  )
}

function addNotice(req,res,next){
    add(req.body).then(
        result=>{
          if(result.result.ok===1){
            res.json({
              code:0,
              des:'success'
          })
          }else{
            res.json({
              code:1,
              des:'failed'
            })
          }
        }
    ).catch(
      err=>next(err)
    )
}

module.exports = router;