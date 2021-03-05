var db = require("../config/db.js");


exports.list = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err)
    }
    connection.query('SELECT SQL_CALC_FOUND_ROWS * FROM department WHERE 1=1;', null, (err, results, fields) => {
      if (err) {
        reject(err)
      }
      connection.query('SELECT FOUND_ROWS() as total;', null, (err, total, fields) => {
        if (err) {
          reject(err)
        }
        let obj = {
          total: total[0].total,
          data: results
        }
        connection.release()
        resolve(obj)
      })
    })
  })
})