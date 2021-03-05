const express = require("express");
const router = express.Router();
const sha1 = require("sha1");
const https = require("https");
const { wechatConfig, testWechatConfig } = require("../config/tencent-sms.js");
const axios = require('axios')



router.get("/", (req, response) => {
  let token = new Promise((resolve, reject) => {
    https.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appid}&secret=${wechatConfig.appsecret}`,
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let result = JSON.parse(data);
          resolve(result)
        });
        res.on("error", (e) => {
          console.log(`错误:${e.message}`);
          reject(err)
        });
      }
    );
  })
  token.then(
    res => {
      response.send({
        code:0,
        token:res
      })
    }
  )
});

module.exports = router;
