module.exports = {
  getOtherQuery(obj) {
    var _filter = {
      $and: [],
    };
    for (var i in obj) {
      if (i !== "index" && i !== "size" && obj[i]) {
        if (i === "name") {
          _filter.$and.push({
            name: { $regex: obj["name"] },
          });
        }
        if (i === "address") {
          _filter.$and.push({
            address: { $regex: obj["address"] },
          });
        }
        if (i === "salary") {
          _filter.$and.push({
            salary: Number(obj["salary"]),
          });
        }
        if (i === "ageStart") {
          _filter.$and.push({
            age: { $gte: Number(obj["ageStart"]), $lte: Number(obj["ageEnd"]) },
          });
        }
      }
    }
    if (_filter.$and.length === 0) {
      _filter = {};
    }
    return _filter;
  },
};
