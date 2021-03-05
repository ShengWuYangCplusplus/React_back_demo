var MongoClient = require("mongodb").MongoClient;
var sd = require("silly-datetime");
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl,theDatabase } = require("../../config/mongodbConfig.js");
const { getOtherQuery } = require("./search-util");
const bcrypt = require("bcryptjs");
exports.validate = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (cerr, db) => {
        if (cerr) reject("db connect error");
        let collection = db.db("runoob").collection("users");
        collection.findOne({ Account: req.account }, (Ferr, result) => {
          if (Ferr) reject(Ferr);
          resolve(result);
          db.close()
        });
      }
    );
  });

exports.detail = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (cerr, db) => {
        if (cerr) reject("db connect error");
        let collection = db.db("runoob").collection("users");
        console.log("reqqqqqq", req);
        collection.findOne(
          { _id: new ObjectID(req.userId) },
          (derr, result) => {
            if (derr) reject(derr);
            db.db(theDatabase).collection("role").findOne({
              intId:parseInt(result.roleId)
            },(ferr,authRes)=>{
              if(ferr)reject(ferr)
              resolve({
                ...result,auth:authRes.auth
              })
              db.close()
            })
          }
        );
      }
    );
  });

exports.insertSome = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        var someObj = JSON.parse(req);
        dbo.collection("users").insertMany(someObj, (err, result) => {
          if (err) reject("db execute error");
          resolve(result);
          db.close();
        });
      }
    );
  });
exports.list = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (cError, db) {
        console.log(cError);
        if (cError) reject(cError);
        let dbo = db.db("runoob");
        let index = Number(req.index);
        let size = Number(req.size);
        let condition = { ...req };
        let theQuery = getOtherQuery(condition);
        dbo
          .collection("users")
          .find({ ...theQuery })
          .skip(parseInt(index * size))
          .limit(parseInt(size))
          .toArray(function (eError, result) {
            if (eError) reject("db execute error");
            dbo
              .collection("users")
              .find({ ...theQuery })
              .count(function (error, count) {
                if (error) reject("db execute error");
                resolve({
                  data: result,
                  total: count,
                  index: index,
                  size: size,
                });
                db.close();
              });
          });
      }
    );
  });
exports.addUser = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (cerr, db) => {
        if (cerr) {
          reject(cerr);
        }
        //先判断 account是否存在
        let collection = db.db("runoob").collection("users");
        collection.findOne({ Account: req.account }, (derr, result) => {
          if (result && result._id) {
            resolve("exist");
          } else if (result === null) {
            var salt = bcrypt.genSaltSync(10); //设置加密等级，如果不设置默认为10，最高为10
            var hash = bcrypt.hashSync(req.password, salt);
            collection.insertOne(
              {
                Account: req.account,
                Password: hash,
                roleId: req.roleId,
                departmentId: req.departmentId,
                time: sd.format(new Date(), "YYYY-MM-DD HH:mm:ss"),
              },
              (Ierr, insertResult) => {
                if (Ierr) reject("db execute error");
                resolve(insertResult);
                db.close();
              }
            );
          }
        });
      }
    );
  });

exports.deleteUser = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo
          .collection("users")
          .findOneAndDelete({ _id: new ObjectID(req._id) }, (err, result) => {
            if (err) reject("db execute error");
            resolve(result);
            db.close();
          });
      }
    );
  });

exports.updateUser = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        console.log("req",req)
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        var whereStr = { _id: new ObjectID(req._id) }; // 查询条件
        delete req._id;
        dbo
          .collection("users")
          .updateOne(whereStr, {$set:{name:req.name}}, { multi: true }, (err, result) => {
            if (err) reject("db execute error");
            resolve(result);
            db.close();
          });
      }
    );
  });
exports.dbTotal = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo.collection("users").aggregate(
          [
            {
              $group: {
                _id: null,
                total: { $sum: "$level" },
              },
            },
          ],
          (error, cursor) => {
            if (error) reject("db execute error");
            cursor.toArray((errr, result) => {
              resolve(result);
              db.close();
            });
          }
        );
      }
    );
  });
exports.createLog = (opt) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        let collection = db.db("runoob").collection("login-log");
        let obj = {
          ...opt,
          time: sd.format(new Date(), "YYYY-MM-DD HH:mm:ss"),
        };
        collection.insertOne(obj, (derr, result) => {
          if (derr) {
            reject(derr);
          }
          resolve(result);
          db.close();
        });
      }
    );
  });
