/**
 * 日志记录
 */
var db = require("../config/db.js");
const schema = {
  ip: { type: String, required: false }, // 访问者的ip
  method: { type: String, required: false }, // 调用方法
  time: { type: Number, required: false }, // 响应时间
  code: { type: Number, required: false }, // 状态码
}