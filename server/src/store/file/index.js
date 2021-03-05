var MongoClient=require('mongodb').MongoClient
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl } = require("../../config/mongodbConfig.js");
const { getOtherQuery } = require("./search-util");

exports.getFile=(req)=>new Promise((resolve,reject)=>{
    MongoClient.connect(mongodbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(cerr,db)=>{
        if (cerr) reject(cerr);
        let collection = db.db("runoob").collection('file');
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

exports.deleteFile=(req)=>new Promise(
  (resolve,reject)=>{
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        let collection = db.db("runoob").collection('file');
        collection
          .findOneAndDelete({ _id: new ObjectID(req.fileId) }, (err, result) => {
            if (err) reject("db execute error");
            resolve(result);
            db.close();
          });
      }
    );
  }
)

