var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl } = require("../config/mongodbConfig.js");

exports.insertRecord=(req)=>new Promise(
  (resolve,reject)=>{
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo.collection("sms").insertOne(req, (err, result) => {
          if (err) reject("db execute error");
          resolve(result);
          db.close();
        });
      }
    );
  }
)