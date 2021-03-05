const express = require('express');
const router = express.Router();
const { checkCode } = require('../store/register.js')

var mysql = require("../config/db.js");
var sd = require('silly-datetime')

router.post('/', validateSms)
module.exports = router;

function validateSms(req, res, next) {
  checkCode(req.body).then(
    result => {
      if (result && result.length > 0) {
        let record = result[0];
        if (Date.now() - record.time > 600000) {
          res.send(
            {
              code: 1,
              des: '验证码已过期,请重新发送'
            }
          )
        } else {
          if (req.body.code === record.code) {
            mysql.getConnection((conerr, connection) => {
              if (conerr) {
                next(conerr)
              }
              let data=req.body;
              connection.query("INSERT INTO userinfo (Account,UserName,Phone,Password,DepartmentId,RoleId,RegistTime) VALUES (?,?,?,?,?,?,?)", [data.account, data.userName, data.phone, data.password, 1, 1,sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], (err, results, fields) => {
                if (err) {
                  reject(err)
                }
                connection.release()
                if(results.serverStatus===2){
                    res.send(
                      {
                        code: 0,
                        des: '注册成功!'
                      }
                    )
                }
              })
            })
          }
        }
      }else{
        res.send({
          code:1,
          des:'验证码不正确,请重新发送'
        })
      }

    }
  )
}