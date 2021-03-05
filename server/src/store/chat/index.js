var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var sd = require('silly-datetime')
const { mongodbUrl,theDatabase } = require("../../config/mongodbConfig.js");

exports.addChat =async (req) =>{

    let result=await MongoClient.connect(
        mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (cerr, db) => {
        if (cerr) return false;
        let collection = db.db(theDatabase).collection("chat");
        collection.insertOne({ ...req }, (derr, result) => {
          if (derr) return false;
          return true
        });
      }
    );
    return result
}


//获取最近两百条聊天记录
exports.search = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
        mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (cerr, db) => {
        if (cerr) reject(cerr);
        let collection = db.db(theDatabase).collection("chat");
        collection
          .find()
          .limit(200)
          .toArray(function (derr, result) {
            if (derr) reject("db execute error");
            collection.find().count(function (aderr, count) {
              if (aderr) reject("db execute error");
              resolve({
                data: result,
                total: count,
              });
              db.close();
            });
          });
      }
    );
  });


