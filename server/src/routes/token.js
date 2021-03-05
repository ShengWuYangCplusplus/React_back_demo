const express = require("express");
const router = express.Router();
var jwt = require("../util/jwt");
const { validate, list, createLog } = require("../store/users/index.js");
const toUtf = require("../util/base-to-utf8.js");
const bcrypt = require("bcryptjs");

router.post("/", authenticate);
module.exports = router;

function authenticate(req, res, next) {
  var reqUser = toUtf(req);
  validate(reqUser)
    .then((user) => {
      if (user && user._id) {
        if (bcrypt.compareSync(reqUser.password, user.Password)) {
          const token = jwt.sign({
            account: user.Account,
            identity: user._id,
            roleId: Number(user.roleId),
          });
          const obj = {
            code: 0,
            des: "success",
            data: user,
            token,
          };
          let theUser={...user,userId:user._id}
          delete theUser._id
          createLog(theUser)
            .then((data) => {
              res.json(obj);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          res.status(200).json({
            code: 1,
            des: "密码错误!",
          });
        }
      } else {
        res.status(200).json({
          code: 1,
          des: "账号不存在,请先注册!",
        });
      }
    })
    .catch((err) => next(err));
}
