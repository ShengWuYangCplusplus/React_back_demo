exports.getOtherQuery=(obj)=> {
    var _filter = {
      $and: [],
    };
    for (var i in obj) {
      if (i !== "index" && i !== "size" && obj[i]) {
        if (i === "userId") {
          _filter.$and.push({
            "users.userId": { $regex: obj["userId"] },
          });
        }
        if (i === "address") {
          _filter.$and.push({
            address: { $regex: obj["address"] },
          });
        }
        if (i === "type") {
          _filter.$and.push({
            type: Number(obj["type"]),
          });
        }
        if (i === "status") {
          _filter.$and.push({
            status: Number(obj["status"]),
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
  }