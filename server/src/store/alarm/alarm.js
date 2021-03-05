var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const { mongodbUrl } = require("../../config/mongodbConfig.js");
const { getOtherQuery } = require("./serach-util");

exports.insertSome = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        var someObj = [
          {
            type: 1,
            time: "2020-05-05 12:43:07",
            address: "上海市青浦区夏阳街道aaaa",
            status: 1,
            level: 1,
            position: "121.057934,31.108934",
          },
          {
            type: 2,
            time: "2020-05-05 12:43:07",
            address: "上海市青浦区夏阳街道aaaa",
            status: 2,
            level: 2,
            position: "120.924811,31.035683",
          },
          {
            type: 3,
            time: "2020-05-05 12:43:07",
            address: "上海市青浦区夏阳街道aaaa",
            status: 3,
            level: 3,
            position: "121.059923,31.082018",
          },
        ];
        dbo.collection("alarm").insertMany(someObj, (err, result) => {
          if (err) reject("db execute error");
          resolve(result);
          db.close();
        });
      }
    );
  });
exports.getAlarm = (req) =>
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
          .collection("alarm")
          .find({ ...theQuery })
          .skip(parseInt(index * size))
          .limit(parseInt(size))
          .toArray(function (eError, result) {
            if (eError) reject("db execute error");
            dbo
              .collection("alarm")
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
exports.addAlarm = (alarm) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo.collection("alarm").insertOne(alarm, (err, result) => {
          if (err) reject("db execute error");
          resolve(result);
          db.close();
        });
      }
    );
  });

exports.deleteAlarm = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        dbo
          .collection("alarm")
          .findOneAndDelete({ _id: new ObjectID(req._id) }, (err, result) => {
            if (err) reject("db execute error");
            resolve(result);
            db.close();
          });
      }
    );
  });

exports.updateAlarm = (req) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        if (err) reject("db connect error");
        var dbo = db.db("runoob");
        var whereStr = { _id: new ObjectID(req._id) }; // 查询条件
        delete req._id;
        var updateStr = { $set: { ...req } };
        dbo
          .collection("alarm")
          .updateOne(whereStr, updateStr, { multi: true }, (err, result) => {
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
        dbo.collection("alarm").aggregate(
          [
            {
              $group: {
                _id: null,
                total: { $sum: "$level" }
             }
            },
          ],
          (error, cursor) => {
            if (error) reject("db execute error");
            cursor.toArray((errr,result)=>{
              resolve(result)
              db.close()
            });
          }
        );
      }
    );
  });
