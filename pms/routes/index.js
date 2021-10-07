var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

module.exports = function (db) {
  router.get("/", function (req, res, next) {
    res.render("login", {
      title: "Project Management System",
      loginInfo: req.flash("loginInfo"),
    });
  });

  router.post("/auth", function (req, res, next) {

    db.query(
      "SELECT * FROM users where email = $1 LIMIT 1",
      [req.body.email],
      (err, data) => {
        if (err) {
          console.error("err:", err);
          req.flash("loginInfo", "Terjadi kesalahan!");
          return res.redirect("/");
        }
        if (data.rows.length == 0) {
          req.flash("loginInfo", "Wrong email or password");
          return res.redirect("/");
        }
        bcrypt.compare(
          req.body.password,
          data.rows[0].password,
          (err, result) => {
            if (err) {
              req.flash("loginInfo", "Terjadi kesalahan");
              return res.redirect("/");
            }
            if (!result) {
              req.flash("loginInfo", "Wrong email or password");
              return res.redirect("/");
            }
            delete data.rows[0].password;
            req.session.user = data.rows[0];
            res.redirect("/projects");
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
