const express = require('express');
const router = express.Router();
const { smsConfig } = require('../config/tencent-sms.js')
var QcloudSms = require("qcloudsms_js");
const {insertRecord} =require('../store/sms.js')
router.post('/', getSms)
module.exports = router;

function getSms(req, res, next) {
  console.log("req",req.body.phoneNumber)
  // 实例化 QcloudSms
  var qcloudsms = QcloudSms(smsConfig.appid, smsConfig.appkey);
  var randomNum=Math.random().toString().slice(-6);
  var ssender = qcloudsms.SmsSingleSender();
  var params = [randomNum,"1"];
  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, tcres, resData) {
    if (err) {
      console.log("err: ", err);
      res.send({
        code:1,
        des:`failed:${JSON.stringify(err)}`,
      })
    } else if(resData.result===0){
      insertRecord({phone:req.body.phoneNumber,code:randomNum,time:Date.now()}).then(
        dbres=>{
          console.log('dbres',dbres)
          if(dbres.result.ok===1){
            res.send({
              code:0,
              des:'success',
              code:randomNum,
              phone:req.body.phoneNumber
            })
          }else{
            res.send({
              code:1,
              des:'500 failed'
            })
          }
        }
      )
      console.log("request data: ", tcres.req);
      console.log("response data: ", resData);
    }
  }
  ssender.sendWithParam("86", req.body.phoneNumber, smsConfig.templateId,
    params, smsConfig.smssign, "", "", callback);
}