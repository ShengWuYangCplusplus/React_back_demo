var db = require("../config/db.js");


exports.list = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject('db connect error')
    }
    connection.query('SELECT * FROM org_position WHERE 1=1;', null, (err, results, fields) => {
      if (err) {
        reject('query data error')
      }
      connection.release()
      resolve(results)
    })
  })
})