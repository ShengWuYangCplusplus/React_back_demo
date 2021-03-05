const express = require("express");
var path = require("path");
const router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl ,thePathStr,theDatabase} = require("../../config/mongodbConfig");
var fs=require('fs')
const multer = require("multer");
var storage = multer.diskStorage({
  //指定文件上传到服务器的路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/avatar/"));
  },
  //指定上传到服务器文件的名称
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + "_" + Date.now()+"."+file.originalname.split('.')[1]);
  },
});
var upload = multer({ storage: storage });
router.post("/", upload.single("avatar"), uploadFunc);

module.exports = router;

function uploadFunc(req, res, next) {
  MongoClient.connect(
    mongodbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (cerr, db) => {
      if (cerr) next(cerr)
      let collection=db.db(theDatabase).collection('users');
      collection.updateOne({_id:new ObjectID(req.user.identity)},{$set:{avatar:req.file.path.replace(thePathStr,'')}},{ multi: true },(derr,result)=>{
        if(derr) next(derr)
        console.log("result",result)
        if(result.result.ok===1){
          res.send({
            code:0,
            des:"success",
            path:req.file.path.replace(thePathStr,'')
          })
        }else{
          res.send({
            code:1,
            des:'failed'
          })
        }
        db.close()
      })
    }
    )
  
}

