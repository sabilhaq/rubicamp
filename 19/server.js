const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var helper = require("./helper");

const fs = require("fs");

let file = fs.readFileSync("data.json", "utf-8");
var data = JSON.parse(file);
var dataFile = JSON.parse(file);

const app = express();

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let pagination = {
    totalPage: 3,
    currentPage: 1,
    perPage: 3,
    offset: 0,
  };

  pagination.totalPage = Math.ceil(data.length / pagination.perPage);
  pagination.currentPage = Number(req.query.page ? req.query.page : 1);
  pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

  let filters = [];

  if (req.query.string && req.query.stringCheck == "on") {
    filters.push({ name: "string", value: req.query.string });
  }
  if (req.query.integer && req.query.integerCheck == "on") {
    filters.push({ name: "integer", value: Number(req.query.integer) });
  }
  if (req.query.float && req.query.floatCheck == "on") {
    filters.push({ name: "float", value: parseFloat(req.query.float) });
  }
  if (req.query.boolean && req.query.booleanCheck == "on") {
    filters.push({
      name: "boolean",
      value: req.query.boolean == "true" ? true : false,
    });
  }
  if (req.query.startdate && req.query.dateCheck == "on") {
    filters.push({ name: "startdate", value: req.query.startdate });
  }
  if (req.query.enddate && req.query.dateCheck == "on") {
    filters.push({ name: "enddate", value: req.query.enddate });
  }

  for (let i = 0; i < filters.length; i++) {
    switch (filters[i].name) {
      case "string":
        data = data.filter((dataObj) => {
          return dataObj.string == filters[i].value;
        });
        break;

      case "integer":
        data = data.filter((dataObj) => {
          return dataObj.integer == filters[i].value;
        });
        break;

      case "float":
        data = data.filter((dataObj) => {
          return dataObj.float == filters[i].value;
        });
        break;

      case "boolean":
        data = data.filter((dataObj) => {
          return dataObj.boolean == filters[i].value;
        });
        break;

      case "startdate":
        data = data.filter((dataObj) => {
          return (
            dataObj.date >= filters[i].value &&
            dataObj.date <= filters[i + 1].value
          );
        });
        break;

      default:
        break;
    }
  }
  res.render("index", { data, dataFile, helper, pagination });
});

app.get("/add", (req, res) => res.render("add"));

app.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  let obj = dataFile[id];
  obj.id = id;
  res.render("edit", { obj });
});

app.post("/add", (req, res) => {
  dataFile.push({
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean == "true" ? true : false,
  });
  let newData = JSON.stringify(dataFile);
  fs.writeFileSync("data.json", newData);
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
  let id = req.params.id;
  dataFile[id].string = req.body.string;
  dataFile[id].integer = parseInt(req.body.integer);
  dataFile[id].float = parseFloat(req.body.float);
  dataFile[id].date = req.body.date;
  dataFile[id].boolean = req.body.boolean == "true" ? true : false;
  let newData = JSON.stringify(dataFile);
  fs.writeFileSync("data.json", newData);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  data.splice(id, 1);
  let newData = JSON.stringify(data);
  fs.writeFileSync("data.json", newData);
  res.redirect("/");
});

app.listen(port, () =>
  console.log(`Listening on port ${port}. Click: http://localhost:3000`)
);
