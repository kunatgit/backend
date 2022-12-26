const e = require("express");
const mysql = require("mysql");
const conn = require("../../dbconnect");
var constants = require("../lib/constant");
var validate = require("./validate");
var mergeJSON = require("merge-json");


async function getAllUser(req, res) {
  let keyword =req.query.keyword || "";
  let page = parseInt(req.query.page);
  let per_page = parseInt(req.query.per_page);
  let startIdx = (page-1) * per_page;
  if(keyword == ""){
    let sql = "select * from users LIMIT ?, ?";
    const result = await callDatabase(sql,[startIdx,per_page]);
    const count = await callDatabase('select count(userid) as total from users');
    const total = count[0].total;
    res.status(200).json({
      page: page,
      per_page: per_page,
      total: total,
      data: result
    });
  }else{
    let sql = "select * from users where (name like ? or email like ?) LIMIT ?, ?";
    const result = await callDatabase(sql,[("%"+keyword+"%"),("%"+keyword+"%"),startIdx,per_page]);
    let sqlCount = "select count(userid) as total from users where (name like ? or email like ?) ";
    const count = await callDatabase(sqlCount,[("%"+keyword+"%"),("%"+keyword+"%")]);
    const total = count[0].total;
    res.status(200).json({
      page: page,
      per_page: per_page,
      total: total,
      data: result
    });
  }
  
}

async function getUser(req, res) {
  let q = req.query.q || "";
  let start = req.query.start || "";
  let limit = req.query.limit || "";
  if (validate.isLimit(start, limit)) {
    let sql =
      "select * from users where (name like ? or email like ?) LIMIT ?, ?";
    const result = await callDatabase(sql, [
      "%" + q + "%",
      "%" + q + "%",
      parseInt(start),
      parseInt(limit),
    ]);
    res.status(200).json(result);
  } else {
    res.status(400).json({
      status: false,
      message: "Invalid start or limit",
      statusCode: constants.status_400,
    });
  }
}

async function getUserById(req, res) {
  let userId = req.params.userId || "";
  if (!isNaN(userId)) {
    let sql = "select * from users where userId = ?";
    const result = await callDatabase(sql, [parseInt(userId)]);
    res.status(200).json(result);
  } else {
    res.status(400).json({
      status: false,
      message: { userId: "Invalid userId" },
      statusCode: constants.status_400,
    });
  }
}

async function createUser(req, res) {
  let jsonBody = req.body;
  // console.log('json req => ',jsonBody);
  let name = jsonBody.name;
  let age = jsonBody.age;
  let email = jsonBody.email;
  let avatarUrl = jsonBody.avatarUrl;
  let check = validate.checkCreateUser(name, age, email);
  if (check.status) {
    const result = await callDatabase("select * from users where email = ?", [
      email,
    ]);
    if (result.length > 0) {
      res.status(400).json({
        status: false,
        message: { email: "Email already Exists" },
        statusCode: constants.status_400,
      });
    } else {
      let sql =
        "INSERT INTO users(name, age, email, avatarUrl) VALUES(?, ?, ?, ?);";
      const result = await callDatabase(sql, [
        name,
        parseInt(age),
        email,
        avatarUrl,
      ]);
      const getData = await callDatabase(
        "select * from users where email = ?",
        [email]
      );
      res.status(201).json({
        status: true,
        message: "Insert success.",
        statusCode: constants.status_201,
        data: getData,
      });
    }
  } else {
    res.status(400).json(check);
  }
}

async function updateUser(req, res) {
  let userId = req.params.userId;
  let jsonBody = req.body;

  if (!isNaN(userId)) {
    userId = parseInt(userId);
    const findUser = await callDatabase(
      "select * from users where userId = ?",
      [userId]
    );
    console.log("findUser =>", userId);
    if (findUser.length > 0) {
      let newData = mergeJSON.merge(
        JSON.parse(JSON.stringify(findUser[0])),
        jsonBody
      );
      console.log('findUser[0]: ',JSON.stringify(findUser[0]))
      console.log('jsonBody : ',jsonBody)
      console.log('newData : ',newData)
      let check = validate.checkCreateUser(
        newData.name,
        newData.age,
        newData.email
      );
      if (check.status) {
        const findEmail = await callDatabase(
          "select * from users where userId <> ? && email = ?",
          [userId, newData.email]
        );
        if (findEmail.length > 0) {
          res.status(400).json({
            status: false,
            message: { email: "Email already Exists" },
            statusCode: constants.status_400,
          });
        } else {
          let sql =
            "UPDATE users SET name=?, age=?, email=?, avatarUrl=? WHERE userId=?";
          let data = [
            newData.name,
            parseInt(newData.age) || 0,
            newData.email,
            newData.avatarUrl,
            userId,
          ];
          console.log("sql => ", sql);
          console.log("data => ", data);
          const result = await callDatabase(sql, data);
          const getData = await callDatabase(
            "select * from users where userId = ?",
            [userId]
          );
          res.status(200).json({
            status: true,
            message: "Update success.",
            statusCode: constants.status_200,
            data: getData,
          });
        }
      } else {
        res.status(400).json(check);
      }
    } else {
      res.status(400).json({
        status: false,
        message: { userId: "userId not found in database" },
        statusCode: constants.status_400,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: { userId: "Invalid userId" },
      statusCode: constants.status_400,
    });
  }
}

async function deleteUser(req, res) {
  let userId = req.params.userId || "";
  if (!isNaN(userId)) {
    let sql = "DELETE FROM users WHERE userId = ?";
    const result = await callDatabase(sql, [parseInt(userId)]);
    // console.log(result);
    if (result.affectedRows == 1) {
      res.status(200).json({
        message: "Delete success",
      });
    } else {
      res.status(500).json({
        message: "Delete fail",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: { userId: "Invalid userId" },
      statusCode: constants.status_400,
    });
  }
}

function callDatabase(sql, data) {
  return new Promise((resolve, reject) => {
    conn.query(sql, data, function (err, result) {
      if (err) {
        console.log("Error: " + err);
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
};
