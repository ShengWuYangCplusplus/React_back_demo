const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://101.132.167.31:27017/"
var getOtherQuery=require('../../util/mongodb.js').getOtherQuery


router.get('/', search)
router.post('/', addOne)
router.post('/many', addSome)
router.put('/', updateOne)
router.delete('/', deleteOne)


function search(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (cError, db) {
    if (cError) next(cError);
    let dbo = db.db('runoob');
    let index=Number(req.query.index)
    let size=Number(req.query.size)
    let condition = {...req.query};
    let theQuery=getOtherQuery(condition)
    console.log(theQuery['$and'])
    dbo.collection('site').find({...theQuery}).skip(parseInt(index*size)).limit(parseInt(size)).toArray(function (eError, result) {
      if (eError) next(eError);
      dbo.collection('site').find({...theQuery}).count(function(error,count){
          if(error)next(error)
          res.json({
            code: 0,
            data: result,
            total:count,
            index:index,
            size:size,
            des: 'success'
          })
          db.close()
      })
    })
  })
}
function addOne(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) next(err);
    var dbo = db.db('runoob');
    var myobj = { name: '神武', url: 'youziweb.cn' };
    dbo.collection('site').insertOne(myobj, (err, result) => {
      if (err) throw err;
      res.json({
        code: 0,
        des: "success"
      })
      db.close()
    })
  })
}
function addSome(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) netx(err);
    var dbo = db.db('runoob');
    var someObj = [
      { name: '小A', age: 25, salary: 20,address:'青浦区信息大楼12层' },
      { name: '小B', age: 26, salary: 25 ,address:'浦东新区井盖楼C栋'},
      {
        name: '小C', age: 1, salary: -3,address:'徐汇区龙华菜市场2号'
      }
    ]
    dbo.collection('site').insertMany(someObj, (err, result) => {
      if (err) next(err)
      res.json({
        code: 0,
        data: result.insertedCount,
        des: 'success'
      })
      db.close()
    })
  })
}

function updateOne(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) next(err);
    var dbo = db.db('runoob');
    var wheresStr = { ...req.body }  //查询条件
    var updateStr = { $set: { "url": "http://youziweb.cn:8588" } };
    dbo.collection("site").updateOne(wheresStr, updateStr, (err, result) => {
      if (err) next(err);
      res.json({
        code: 0,
        des: 'success'
      })
      db.close()
    })
  })
}

function deleteOne(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) next(err);
    var dbo = db.db('runoob');
    var whereStr = { ...req.query }
    dbo.collection('site').deleteOne(whereStr, (err, obj) => {
      if (err) next(err);
      res.json({
        code: 0,
        des: 'success',
        data: obj
      })
    })
  })
}

module.exports = router