var constants = require("../lib/constant");
function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function isLimit(start, limit) {
  if (!isNaN(start) && !isNaN(limit)) {
    return true;
  } else {
    return false;
  }
}

function isJSON(obj) {
  try {
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch (e) {
    return false;
  }
}

function isEmptyStr(str) {
  if (typeof str === "string" && str.trim().length === 0) {
    return true;
  } else {
    return false;
  }
}

function checkCreateUser(name, age, email) {
  let data = {
    status: true,
    message: {},
    statusCode: constants.status_400,
  };
  if (!name) {
    data.message.name = "Invalid name";
    data.status = false;
  }
  if (isNaN(age)) {
    data.message.age = "Invalid age";
    data.status = false;
  }
  if (!isEmail(email)) {
    data.message.email = "Invalid email";
    data.status = false;
  }
  return data;
}
module.exports = {
  isEmail,
  isLimit,
  isJSON,
  isEmptyStr,
  checkCreateUser,
};
