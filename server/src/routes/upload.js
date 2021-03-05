const express = require("express");
var path = require("path");
const router = express.Router();
const multer = require("multer");
var storage = multer.diskStorage({
  //指定文件上传到服务器的路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/image/"));
  },
  //指定上传到服务器文件的名称
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now()+".jpg");
  },
});
var upload = multer({ storage: storage });
// var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
router.post("/image", upload.single("avatar"), uploadFunc);
module.exports = router;

function uploadFunc(req, res, next) {
  res.send({
    path:req.file.path.replace('/usr/src/React_All/src/public',''),
    code: 0,
    des: "success",
  });
}
