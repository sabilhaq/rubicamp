const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var helper = require("./helper");

const fs = require("fs");
const e = require("express");

let file = fs.readFileSync("data.json", "utf-8");
let data = JSON.parse(file);
var dataFile = JSON.parse(file);

const app = express();

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let pagination = {};
  let data = [];
  if (req.query.page) {
    let pageNumber = Number(req.query.page);
    pagination.page = pageNumber;
    pagination.previousPage = pageNumber - 1;
    pagination.nextPage = pageNumber + 1;
  } else {
    pagination.page = 1;
    pagination.nextPage = 2;
  }
  console.log("pagination:", pagination);
  let filterObj = req.query;

  for (const key in filterObj) {
    switch (key) {
      case "startdate":
      case "enddate":
      case "id":
      case "string":
        filterObj[key] = filterObj[key];
        break;
      case "integer":
        filterObj[key] = Number(filterObj[key]);
        break;
      case "float":
        filterObj[key] = parseFloat(filterObj[key]);
        break;
      case "boolean":
        filterObj[key] = filterObj[key] == "true" ? true : false;
        break;

      default:
        break;
    }

    data = dataFile.filter((element, index) => {
      if (key == "startdate") {
        console.log(
          element["date"] >= filterObj["startdate"] &&
            element["date"] <= filterObj["enddate"]
        );
        return (
          element["date"] >= filterObj["startdate"] &&
          element["date"] <= filterObj["enddate"]
        );
      } else {
        console.log("masuk sini berapa kali sih:", index);
        return element[key] == filterObj[key];
      }
    });
    console.log("data filtered oi:", data);
  }

  if (Object.keys(filterObj).length == 0) {
    if (pagination.page == 1) {
      pagination.data = dataFile.slice(0, 3);
    } else if (pagination.page == 2) {
      pagination.data = dataFile.slice(3, 6);
    } else if (pagination.page == 3) {
      pagination.data = dataFile.slice(6, 9);
    }

    startSlice = (pagination.page - 1) * 3;
    endSlice = startSlice + 3;
    pagination.data = dataFile.slice(startSlice, endSlice);
  } else {
    if (pagination.page == 1) {
      pagination.data = data.slice(0, 3);
    } else if (pagination.page == 2) {
      pagination.data = data.slice(3, 6);
    } else if (pagination.page == 3) {
      pagination.data = data.slice(6, 9);
    }

    startSlice = (pagination.page - 1) * 3;
    endSlice = startSlice + 3;
    pagination.data = data.slice(startSlice, endSlice);
  }

  res.render("index", { data, dataFile, helper, filterObj, pagination });
});

app.post("/", (req, res) => {
  console.log("req.body post /: ", req.body);
  urlPath = "/";
  let filters = [];
  let formatedUrl = "";

  if (Object.keys(req.body).length > 0) {
    if (req.body.id) {
      filters.push({ name: "id", value: req.body.id });
    }
    if (req.body.string && req.body.string[1]) {
      filters.push({ name: "string", value: req.body.string[1] });
    }
    if (req.body.integer && req.body.integer[1]) {
      filters.push({ name: "integer", value: req.body.integer[1] });
    }
    if (req.body.float && req.body.float[1]) {
      filters.push({ name: "float", value: req.body.float[1] });
    }
    if (req.body.boolean) {
      console.log("masuk");
      console.log(req.body.boolean);
      if (req.body.boolean[1] != "n") {
        filters.push({ name: "boolean", value: req.body.boolean[1] });
      }
    }
    if (req.body.startdate) {
      filters.push({ name: "startdate", value: req.body.startdate });
    }
    if (req.body.enddate) {
      filters.push({ name: "enddate", value: req.body.enddate });
    }

    console.log("filters:", filters);

    if (filters.length > 0) {
      urlPath += "?";

      filters.forEach((filter) => {
        switch (filter.name) {
          case "id":
            urlPath += "id=" + filter.value + "&";
            break;
          case "string":
            urlPath += "string=" + filter.value + "&";
            break;
          case "integer":
            urlPath += "integer=" + filter.value + "&";
            break;
          case "float":
            urlPath += "float=" + filter.value + "&";
            break;
          case "boolean":
            urlPath += "boolean=" + filter.value + "&";
            break;
          case "startdate":
            urlPath += "startdate=" + filter.value + "&";
            break;
          case "enddate":
            urlPath += "enddate=" + filter.value + "&";
            break;

          default:
            break;
        }
      });

      console.log("urlPath:", urlPath);
      formatedUrl = urlPath.slice(0, -1);
      console.log("formatedUrl:", formatedUrl);
      res.redirect(formatedUrl);
    } else {
      res.redirect(urlPath);
    }
  } else {
    res.redirect(urlPath);
  }
});

app.get("/add", (req, res) => res.render("add"));

app.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  let obj = dataFile[id];
  obj.id = id;
  res.render("edit", { obj });
});

app.post("/add", (req, res) => {
  console.log(req.body);
  dataFile.push({
    string: req.body.string,
    integer: Number(req.body.integer),
    float: parseFloat(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean == "true" ? true : false,
  });
  console.log({
    string: req.body.string,
    integer: req.body.integer,
    float: req.body.float,
    date: req.body.date,
    boolean: req.body.boolean,
  });
  let newData = JSON.stringify(dataFile);
  console.log("newData:", newData);
  fs.writeFileSync("data.json", newData);
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  dataFile[id].string = req.body.string;
  dataFile[id].integer = req.body.integer;
  dataFile[id].float = req.body.float;
  dataFile[id].date = req.body.date;
  dataFile[id].boolean = req.body.boolean;
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
