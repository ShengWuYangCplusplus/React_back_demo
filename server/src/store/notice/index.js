var MongoClient=require('mongodb').MongoClient
var ObjectID = require("mongodb").ObjectID;
var sd = require('silly-datetime')
const { mongodbUrl ,theDatabase} = require("../../config/mongodbConfig.js");
const { getOtherQuery } = require("./search-util");

exports.add=(req)=>new Promise((resolve,reject)=>{
  console.log("req  add",req)
  MongoClient.connect(mongodbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(cerr,db)=>{
    if(cerr) reject(cerr)
    let collection=db.db(theDatabase).collection('notice')
    const users=req.users.split(',').map(item=>{
      return ({
        userId:item.split('-')[0],
        name:item.split('-')[1],
        hasRead:false
      })
    })
    collection.insertOne({...req,users:users,addTime:sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')},(derr,result)=>{
      if(derr) reject(derr)
      resolve(result)
    })
  })
})

exports.search=(req)=>new Promise((resolve,reject)=>{
    MongoClient.connect(mongodbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(cerr,db)=>{
        if (cerr) reject(cerr);
        let collection = db.db(theDatabase).collection('notice');
        let index = Number(req.index);
        let size = Number(req.size);
        let condition = { ...req };
        let theQuery = getOtherQuery(condition);
          collection
          .find({ ...theQuery })
          .skip(parseInt(index * size))
          .limit(parseInt(size))
          .toArray(function (derr, result) {
            if (derr) reject("db execute error");
            collection
              .find({ ...theQuery })
              .count(function (aderr, count) {
                if (aderr) reject("db execute error");
                resolve({
                  data: result,
                  total: count,
                  index: index,
                  size: size,
                });
                db.close();
              });
          });
    })
})
exports.searchUserNotice=(req)=>new Promise((resolve,reject)=>{
    MongoClient.connect(mongodbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(cerr,db)=>{
        if (cerr) reject(cerr);
        let collection = db.db(theDatabase).collection('notice');
        let index = Number(req.index);
        let size = Number(req.size);
        let condition = { ...req };
        let theQuery = getOtherQuery(condition);
          collection
          .find({ ...theQuery })
          .skip(parseInt(index * size))
          .limit(parseInt(size))
          .toArray(function (derr, result) {
            if (derr) reject("db execute error");
            collection
              .find({ ...theQuery })
              .count(function (aderr, count) {
                if (aderr) reject("db execute error");
                resolve({
                  data: result,
                  total: count,
                  index: index,
                  size: size,
                });
                db.close();
              });
          });
    })
})