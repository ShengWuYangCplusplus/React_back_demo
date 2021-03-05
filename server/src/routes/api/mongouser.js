const express = require("express");
const router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://101.132.167.31:27017/";

router.get("/", search);
router.get("/total", getTotal);
router.post("/some", addSome);
router.post("/", addOne);
router.put("/", updateOne);
router.delete("/", deleteOne);
const {getUser,addUser,deleteUser,updateUser,insertSome,dbTotal } = require('../../store/users/index')



function addSome(req, res, next) {
  insertSome(req.body.users).then(result=>{
    if(result.result.ok===1){
      res.json({
        code:0,
        des:"success"
      })
      return false
    }else{
      res.json({
        code:1,des:'failed'
      })
      return false
    }
  })
}
function addOne(req, res, next) {
  addUser(req.body).then(
    result => {
      if(result.result.ok===1){
        res.json({
          code:0,des:"success"
        })
      }else{
        res.json({
          code:1,des:`failed:${JSON.stringify(result)}`
        })
      }
    }
  ).catch(
    err => next(err)
  )
}
function search(req, res, next) {
  getUser(req.query).then(
    result => {
      if(result){
        res.json({
          code:0,...result,des:"success"
        })
      }else{
        res.json({
          code:1,des:`failed:${JSON.stringify(result)}`
        })
      }
    }
  ).catch(
    err => next(err)
  )
}
function getTotal(req, res, next) {
  dbTotal(req.query).then(
    result => {
        res.json({
          code:0,...result,des:"success"
        })
    }
  ).catch(
    err => next(err)
  )
}
function deleteOne(req, res, next) {
  deleteUser(req.query).then(
    result => {
      if(result.value&&result.ok===1){
        res.json({
          code:0,des:"success"
        })
      }else{
        res.json({
          code:1,des:`failed:${JSON.stringify(result)}`
        })
      }
    }
  ).catch(
    err => next(err)
  )
}
function updateOne(req, res, next) {
  updateUser(req.body).then(
    result => {
      if(result.result.ok===1){
        res.json({
          code:0,des:"success"
        })
      }else{
        res.json({
          code:1,des:`failed:${JSON.stringify(result)}`
        })
      }
    }
  ).catch(
    err => next(err)
  )
}

module.exports = router;