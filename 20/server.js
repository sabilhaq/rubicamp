const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
var bodyParser = require("body-parser");

var helper = require("./helper");

const bread_db = path.join(__dirname, "db", "bread.db");
const db = new sqlite3.Database(bread_db, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'bread.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS data_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  string_type VARCHAR(100),
  int_type INTEGER,
  float_type FLOAT,
  date_type DATE,
  boolean_type BOOLEAN
);`;

db.run(sql_create, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Successful creation of the 'data_type' table");
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let pagination = {
    totalPage: 3,
    currentPage: 1,
    perPage: 3,
    offset: 0,
  };
  let filters = [];
  let args = [];

  pagination.currentPage = Number(req.query.page ? req.query.page : 1);
  pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

  if (req.query.string && req.query.stringcheck == "on") {
    filters.push({ name: "string", value: req.query.string });
  }
  if (req.query.integer && req.query.integercheck == "on") {
    filters.push({ name: "integer", value: Number(req.query.integer) });
  }
  if (req.query.float && req.query.floatcheck == "on") {
    filters.push({ name: "float", value: parseFloat(req.query.float) });
  }
  if (req.query.boolean && req.query.booleancheck == "on") {
    filters.push({
      name: "boolean",
      value: req.query.boolean == "true" ? true : false,
    });
  }
  if (req.query.startdate && req.query.datecheck == "on") {
    filters.push({ name: "startdate", value: req.query.startdate });
  }
  if (req.query.enddate && req.query.datecheck == "on") {
    filters.push({ name: "enddate", value: req.query.enddate });
  }

  let sql = `SELECT * FROM data_type`;
  if (filters.length > 0) {
    sql += " WHERE";

    if (req.query.string && req.query.stringcheck == "on") {
      sql += " AND string_type = ?";
      args.push(req.query.string);
    }
    if (req.query.integer && req.query.integercheck == "on") {
      sql += " AND int_type = ?";
      args.push(req.query.integer);
    }
    if (req.query.float && req.query.floatcheck == "on") {
      sql += " AND float_type = ?";
      args.push(req.query.float);
    }
    if (req.query.boolean && req.query.booleancheck == "on") {
      sql += " AND boolean_type = ?";
      args.push(req.query.boolean == "true" ? true : false);
    }
    if (req.query.startdate && req.query.datecheck == "on") {
      sql += " AND date_type >= ?";
      args.push(req.query.startdate);
    }
    if (req.query.enddate && req.query.datecheck == "on") {
      sql += " AND date_type <= ?";
      args.push(req.query.enddate);
    }

    sql = sql.replace(" AND", "");
  }

  sql += " ORDER BY id LIMIT 3 OFFSET ?";

  helper.countRows(db, sql, args, (err, totalRow) => {
    if (err) {
      console.error(err.message);
    }

    db.all(sql, [...args, pagination.offset], (err, rows) => {
      if (err) {
        console.error(err.message);
      }

      pagination.totalPage = Math.ceil(totalRow / pagination.perPage);

      let queryParams = req.url;

      res.render("index", {
        data: rows,
        pagination,
        helper,
        queryParams,
        filters,
      });
    });
  });
});

app.get("/add", (req, res) => {
  res.render("add", {
    data: {
      page: "add",
    },
  });
});

app.post("/add", (req, res) => {
  const sql = `INSERT INTO 
    data_type( 
      string_type, 
      int_type, 
      float_type, 
      date_type, 
      boolean_type
    )
  VALUES
    (?, ?, ?, ?, ?)`;
  const dataType = [
    req.body.string,
    parseInt(req.body.integer),
    parseFloat(req.body.float),
    req.body.date,
    req.body.boolean == "true" ? true : false,
  ];
  db.run(sql, dataType, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM data_type WHERE id = ?`;
  db.get(sql, id, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.render("edit", { data: row });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const dataType = [
    req.body.string,
    parseInt(req.body.integer),
    parseFloat(req.body.float),
    req.body.date,
    req.body.boolean == "true" ? true : false,
    id,
  ];
  const sql = `UPDATE data_type
    SET
      string_type = ?,
      int_type = ?,
      float_type = ?,
      date_type = ?,
      boolean_type = ?
    WHERE
      id = ?`;
  db.run(sql, dataType, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM data_type WHERE id = ?";
  db.run(sql, id, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log(`Server started (http://localhost:3000/)`);
});
