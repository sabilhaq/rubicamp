const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var helper = require("./helper");

const app = express();

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let data = helper.readFile();
  let pagination = {
    totalPage: 3,
    currentPage: 1,
    perPage: 3,
    offset: 0,
  };
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

  pagination.totalPage = Math.ceil(data.length / pagination.perPage);
  pagination.currentPage = Number(req.query.page ? req.query.page : 1);
  pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

  let queryParams = req.url;

  res.render("index", { data, helper, pagination, queryParams, filters });
});

app.get("/add", (req, res) => res.render("add"));

app.get("/edit/:id", (req, res) => {
  let data = helper.readFile();
  let obj = data[req.params.id];
  obj.id = id;
  res.render("edit", { obj });
});

app.post("/add", (req, res) => {
  let data = helper.readFile();
  data.push({
    string: req.body.string,
    integer: parseInt(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean == "true" ? true : false,
  });
  helper.writeFile(data);
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
  let data = helper.readFile();
  let id = req.params.id;
  data[id].string = req.body.string;
  data[id].integer = parseInt(req.body.integer);
  data[id].float = parseFloat(req.body.float);
  data[id].date = req.body.date;
  data[id].boolean = req.body.boolean == "true" ? true : false;
  helper.writeFile(data);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  let data = helper.readFile();
  let id = req.params.id;
  data.splice(id, 1);
  helper.writeFile(data);
  res.redirect("/");
});

app.listen(port, () =>
  console.log(`Listening on port ${port}. Click: http://localhost:3000`)
);
