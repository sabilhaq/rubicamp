var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

module.exports = function (db) {
  router.get("/", function (req, res, next) {
    res.render("login", { title: "Project Management System" });
  });

  router.post("/auth", function (req, res, next) {
    db.query(
      "SELECT * FROM users where email=$1 LIMIT 1",
      [req.body.email],
      (err, data) => {
        if (err) {
          console.error("err:", err);
          return res.send(err);
        }
        if (data.rows.length == 0) {
          return res.send("email doesn't exist");
        }
        bcrypt.compare(
          req.body.password,
          data.rows[0].password,
          (err, result) => {
            if (err) {
              console.error("err:", err);
              return res.send(err);
            }
            if (result) {
              delete data.rows[0].password;
              req.session.user = data.rows[0];
              res.redirect("/projects");
            }
          }
        );
      }
    );
  });

  router.post("/logout", function (req, res, next) {
    req.session.destroy(function (err) {
      if (err) {
        return res.send(err);
      }
      res.redirect("/");
    });
  });

  return router;
};
