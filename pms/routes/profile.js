var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    let query = `SELECT email, position, fulltime FROM users
      WHERE userid = $1
    `;
    db.query(query, [req.session.user.userid], (err, results) => {
      if (err) {
        throw err;
      }
      res.render("profile/edit", {
        title: "Profile",
        userrole: req.session.user.role,
        data: results.rows[0],
        nav: "profile",
      });
    });
  });

  router.post("/", helper.isLoggedIn, function (req, res, next) {
    let query = `UPDATE users SET`;
    let args = [];

    if (req.body.position) {
      query += `, position = $${args.length + 1}`;
      args.push(req.body.position);
    }
    if (req.body.fulltime) {
      query += `, fulltime = $${args.length + 1}`;
      args.push(true);
    } else {
      query += `, fulltime = $${args.length + 1}`;
      args.push(false);
    }

    if (req.body.password) {
      bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {
        if (err) {
          res.send(err);
        }

        query += `, password = $${args.length + 1}`;
        args.push(hashPassword);
        query += ` WHERE userid = $${args.length + 1}`;
        args.push(req.session.user.userid);
        query = query.replace(",", "");

        db.query(query, [...args], (err) => {
          if (err) {
            res.send(err);
          }
          res.redirect("/projects");
        });
      });
    } else {
      query += ` WHERE userid = $${args.length + 1}`;
      args.push(req.session.user.userid);
      query = query.replace(",", "");


      db.query(query, [...args], (err) => {
        if (err) {
          res.send(err);
        }
        res.redirect("/projects");
      });
    }
  });

  return router;
};
