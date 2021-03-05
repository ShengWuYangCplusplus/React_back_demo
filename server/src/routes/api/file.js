const express = require("express");
var path = require("path");
const router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const { mongodbUrl ,thePathStr} = require("../../config/mongodbConfig");
const {getFile,deleteFile} =require('../../store/file/index.js')
var fs=require('fs')
const multer = require("multer");
var storage = multer.diskStorage({
  //指定文件上传到服务器的路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/file/"));
  },
  //指定上传到服务器文件的名称
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + "_" + Date.now()+"."+file.originalname.split('.')[1]);
  },
});
var upload = multer({ storage: storage });
// var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
router.post("/", upload.single("file"), uploadFunc);
router.get('/',search)
router.delete('/',deleteOne)


module.exports = router;

function uploadFunc(req, res, next) {
  console.log(req.user)
  console.log(req.file)
  MongoClient.connect(
    mongodbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (cerr, db) => {
      if (cerr) next(cerr)
      let collection=db.db('runoob').collection('file');
      let obj={
        userId:req.user.identity,
        userName:req.user.name,
        filename:req.file.originalname,
        time:req.file.filename.split('.')[0].split('_')[1],
        size:req.file.size,
        path:req.file.path.replace(thePathStr,'')
      }
      collection.insertOne(obj,(derr,result)=>{
        if(derr) next(derr)
        if(result.result.ok===1){
          res.send({
            code:0,
            des:"success",
            fileName:req.file.filename
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

function search(req,res,next){
  getFile(req.query).then(
    result => {
      if(result){
        res.json({
          code:0,...result,des:"success"
        })
        return false
      }else{
        res.json({
          code:1,des:`failed:${JSON.stringify(result)}`
        })
        return false
      }
    }
  )
}

function deleteOne(req, res, next) {
  deleteFile(req.query).then(
    result => {
      if(result.value&&result.ok===1){
      fs.unlink(path.join(__dirname, `../../public${req.query.filePath}`),function(error){
        if(error){
            console.log(error);
            return false;
        }
        res.send({
          code:0,
          des:'success'
        })
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