var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    res.render("profile/edit", { title: "Profile" });
  });

  router.post("/edit", helper.isLoggedIn, function (req, res, next) {
    // res.render("profile/edit", { title: "Profile" });
    // todo: bikin fungsi edit password, position, type
    res.redirect("/projects");
  });

  return router;
};
