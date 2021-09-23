var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (db) {
  router.get("/add", function (req, res, next) {
    res.render("users/form");
  });

  router.post("/add", function (req, res, next) {
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
      // res.send("users/form");
    });
  });

  return router;
};
