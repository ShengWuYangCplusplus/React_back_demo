const express = require("express");
const router = express.Router();
//导入querystring模块（解析post请求数据）
const fs = require("fs");
const path = require("path");
var db = require("../config/db.js");
// var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
router.post("/image", uploadFunc);
module.exports = router;

function uploadFunc(req, res, next) {
  var imgData = req.body.avatar;
  var ID=parseInt(req.body.ID);
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, "base64");
  let str =
    path.join(__dirname, "../public/uploads/image/") + `${Date.now()}.jpg`;
  let tempPath="/uploads/image/"+Date.now()+".jpg";
  fs.writeFile(str, dataBuffer, function (err, data) {
    if (err) {
      res.send({ code: 1, ...err });
    } else {
      db.getConnection((err, connection) => {
        if (err) {
          next(err)
        }
        let sql='UPDATE userinfo SET AvatarPath="'+tempPath.toString()+'" WHERE ID='+ID+';'
        connection.query(sql, null, (err, results, fields) => {
          if (err) {
            res.send({sql:sql})
            next(err)
          }else{
            res.send({ code: 0, des: "success",rootPath:str, path: str.replace('/usr/src/React_All/src/public','') ,userId:ID,tempPath:tempPath,results:{...results},fields:fields});
          }
          connection.release()
        })
      })
    }
  });
}
