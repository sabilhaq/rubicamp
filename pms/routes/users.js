var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    if (req.session.user.role == "admin") {
      let queryFilter = "";
      let queryConfig = `SELECT usersconfig FROM users WHERE userid = $1`;
      let queryTotalData = `SELECT COUNT(*) as totaldata FROM users`;
      let query = `SELECT userid, firstname, lastname, role, email, position FROM users`;
      let pagination = {
        totalPage: 1,
        currentPage: 1,
        perPage: 3,
        offset: 0,
        param: "",
      };

      pagination.currentPage = parseInt(req.query.page ? req.query.page : 1);
      pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

      // FILTER
      [queryFilter, args, i] = helper.filterQueryParamUsers(
        req.query,
        queryFilter
      );

      if (queryFilter) {
        query += ` WHERE` + queryFilter + ` ORDER BY userid`;
        queryTotalData += ` WHERE` + queryFilter + ` GROUP BY userid`;
        queryTotalData += ` ORDER BY userid`;
      }

      query += ` LIMIT 3 OFFSET $${i + 1}`;

      db.query(queryConfig, [req.session.user.userid], (err, results) => {
        if (err) {
          throw err;
        }

        let config = {};
        results.rows[0].usersconfig.forEach((column) => {
          switch (column) {
            case "userid":
              config.useridcolumn = "userid";
              break;
            case "firstname":
              config.firstnamecolumn = "firstname";
              break;
            case "lastname":
              config.lastnamecolumn = "lastname";
              break;
            case "role":
              config.rolecolumn = "role";
              break;
            case "email":
              config.emailcolumn = "email";
              break;
            case "position":
              config.positioncolumn = "position";
              break;

            default:
              break;
          }
        });

        let queryParamObj = req.query;

        db.query(queryTotalData, [...args], (err, results) => {
          if (err) {
            throw err;
          }

          if (results.rows[0]) {
            pagination.totalPage = Math.ceil(
              results.rows[0].totaldata / pagination.perPage
            );
          } else {
            pagination.totalPage = 1;
          }

          db.query(query, [...args, pagination.offset], (err, results) => {
            if (err) {
              throw err;
            }

            let queryPage = "?page=";

            res.render("users/list", {
              title: "PMS Users",
              userrole: req.session.user.role,
              nav: "users",
              data: results.rows,
              queryParamObj,
              pagination,
              queryPage,
              config,
            });
          });
        });
      });
    } else {
      res.render("error/forbidden", {
        title: "403 Forbidden",
      });
    }
  });

  router.post("/option", helper.isLoggedIn, function (req, res, next) {
    let args = [];
    let query = `UPDATE users SET usersconfig = $1 WHERE userid = $2`;
    if (req.body.useridcolumn) {
      args.push("userid");
    }
    if (req.body.firstnamecolumn) {
      args.push("firstname");
    }
    if (req.body.lastnamecolumn) {
      args.push("lastname");
    }
    if (req.body.emailcolumn) {
      args.push("email");
    }
    if (req.body.rolecolumn) {
      args.push("role");
    }
    if (req.body.positioncolumn) {
      args.push("position");
    }
    db.query(query, [args, req.session.user.userid], (err) => {
      if (err) {
        throw err;
      }
      res.redirect("/users");
    });
  });

  router.get("/add", helper.isLoggedIn, function (req, res, next) {
    res.render("users/form");
  });

  router.post("/add", helper.isLoggedIn, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {
      if (err) {
        res.send(err);
      }

      db.query(
        "INSERT INTO users(email, password, firstname) VALUES($1, $2, $3)",
        [req.body.email, hashPassword, req.body.firstname],
        (err) => {
          if (err) {
            res.send(err);
          }
          res.redirect("/");
        }
      );
    });
  });

  return router;
};
