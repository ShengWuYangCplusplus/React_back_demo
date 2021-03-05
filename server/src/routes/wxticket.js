const express = require("express");
const router = express.Router();
const https = require("https");
const { wechatConfig, testWechatConfig } = require("../config/tencent-sms.js");
const axios = require('axios')
var crypto = require("crypto");
const moment=require('moment')

const getSha1 = function(str) {
  var sha1 = crypto.createHash("sha1"); //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
  sha1.update(str);
  var res = sha1.digest("hex"); //加密后的值d
  return res;
};


// 生成签名函数
const getSignature = function(nowUrl, key) {
  let noncestr = Math.random()
    .toString(36)
    .substr(2); // 随机字符串
  let timestamp = moment().unix(); // 获取时间戳，数值类型
  let jsapi_ticket = `jsapi_ticket=${key}&noncestr=${noncestr}&timestamp=${timestamp}&url=${nowUrl}`;
  // console.log(jsapi_ticket)
  jsapi_ticket = getSha1(jsapi_ticket);
  return {
    noncestr: noncestr,
    timestamp: timestamp,
    signature: jsapi_ticket
  };
};



router.get("/", (req, response) => {
  let token = new Promise((resolve, reject) => {
    https.get(
      `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${req.query.accessToken}&type=jsapi`,
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let result = JSON.parse(data);
          resolve(result)
          // let end=getSignature(req.query.url,result.ticket)
          // resolve(end)
        });
        res.on("error", (e) => {
          console.log(`error:${e.message}`);
          reject(err)
        });
      }
    );
  })
  token.then(
    res => {
      response.send({
        code:0,
        validate:{...getSignature(req.query.url,res.ticket),appid:wechatConfig.appid,ticket:res.ticket}
      })
    }
  )
});

module.exports = router;
