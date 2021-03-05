var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl } = require("../config/mongodbConfig.js");


exports.checkCode=(req)=>new Promise(
  (resolve,reject)=>{
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo.collection("sms").find({phone:req.phone}).sort({time:-1}).skip(0).limit(1).toArray(function(exeErr,exeRes){
          if(exeErr){
            console.log('exeErr',JSON.stringify(exeErr))
          }else{
            resolve(exeRes)
          }
        });
      }
    );
  }
)