const express = require("express");
const router = express.Router();
var MongoClient = require("mongodb").MongoClient;

router.get("/", search);
router.get("/total", getTotal);
router.post("/some", addSome);
router.post("/", addOne);
router.put("/", updateOne);
router.delete("/", deleteOne);
const {getAlarm,addAlarm,deleteAlarm,updateAlarm,insertSome,dbTotal } = require('../../store/alarm/alarm.js')



function addSome(req, res, next) {
  insertSome().then(result=>{
    if(result.result.ok===1){
      res.json({
        code:0,
        des:"success"
      })
    }else{
      res.json({
        code:1,des:'failed'
      })
    }
  })
}
function addOne(req, res, next) {
  addAlarm(req.body).then(
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
  getAlarm(req.query).then(
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
  deleteAlarm(req.query).then(
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
  updateAlarm(req.body).then(
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