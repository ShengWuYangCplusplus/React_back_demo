import { message } from "antd";

const fileTypes = [
  { ".doc": "application/msword" },
  {
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  { ".xls": "application/vnd.ms-excel" },
  {
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  { ".pdf": "application/pdf" },
  { ".pps": "application/vnd.ms-powerpoint" },
  { ".ppt": "application/vnd.ms-powerpoint" },
  {
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  { ".txt": "text/plain" },
  { ".zip": "application/x-zip-compressed" },
  { ".mp3": "audio/x-mpeg" },
  { ".mp4": "video/mp4" },
  { ".png": "image/png" },
  { ".jpeg": "image/jpeg" },
  { ".jpg": "image/jpeg" },
];
const avatarTypes = [
  { ".png": "image/png" },
  { ".jpeg": "image/jpeg" },
  { ".jpg": "image/jpeg" },
];

class YSW_TOOLS {
  static getRandomItem(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  static beforeFileUpload(file, fileList) {
    console.log(file);
    let fileName = true;
    if (file.name.includes("_") || file.name.includes("/")) {
      fileName = false;
      message.error("文件名不能包含 _ / . 字符,请修改文件名后重新上传");
    }
    let isFile = false;
    console.log(file, fileList);
    for (let item of fileTypes) {
      if (file.type == Object.values(item)[0]) {
        isFile = true;
        break;
      }
    }
    if (isFile === false) {
      message.error("请上传正确的文件格式");
    }
    return isFile && fileName;
  }
  static beforeAvatarUpload(file, fileList) {
    console.log(file);
    let fileName = true;
    if (file.name.includes("_") || file.name.includes("/")) {
      fileName = false;
      message.error("文件名不能包含 _ / . 字符,请修改文件名后重新上传");
    }
    let isAvatar = false;
    console.log(file, fileList);
    for (let item of avatarTypes) {
      if (file.type == Object.values(item)[0]) {
        isAvatar = true;
        break;
      }
    }
    if (isAvatar === false) {
      message.error("请上传正确的图片格式");
    }
    return isAvatar && fileName;
  }
  static readWorkbookFromRemoteFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e) {
      if (xhr.status == 200) {
        var data = new Uint8Array(xhr.response);
        var workbook = XLSX.read(data, { type: "array" });
        if (callback) callback(workbook);
      }
    };
    xhr.send();
  }
  static csv2table(csv) {
    var html = "<table>";
    var rows = csv.split("\n");
    rows.pop(); // 最后一行没用的
    rows.forEach(function (row, idx) {
      var columns = row.split(",");
      columns.unshift(idx + 1); // 添加行索引
      if (idx == 0) {
        // 添加列索引
        html += "<tr>";
        for (var i = 0; i < columns.length; i++) {
          html +=
            "<th>" + (i == 0 ? "" : String.fromCharCode(65 + i - 1)) + "</th>";
        }
        html += "</tr>";
      }
      html += "<tr>";
      columns.forEach(function (column) {
        html += "<td>" + column + "</td>";
      });
      html += "</tr>";
    });
    html += "</table>";
    return html;
  }
  static readWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
    var csv = XLSX.utils.sheet_to_csv(worksheet);
    document.getElementById("result").innerHTML = this.csv2table(csv);
  }
  static hasInTree(arr, value) {
    function test(arr, key) {
      if (arr && arr.length > 0) {
        for (let item of arr) {
          if (item.key === value) {
            return item;
          } else {
            return test(arr.children, key);
          }
        }
      }
    }
    return test(arr, value);
  }
  /**
   * 遍历树  得到相等的value对应的path
   */
  static getFirstRoutePath(item, jsonData) {
    let json = {};
    function test(item, jsonData) {
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].auth == item) {
          json = { ...jsonData[i] };
          return json;
        } else {
          if (jsonData[i].children && jsonData[i].children.length > 0) {
            test(item, jsonData[i].children);
          }
        }
      }
    }
    test(item,jsonData)
    return json
  }
}
export default YSW_TOOLS;
