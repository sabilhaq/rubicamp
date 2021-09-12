const Pool = require("pg").Pool;
const pool = new Pool({
  user: "sabil",
  host: "localhost",
  database: "bread-db",
  password: "sabil",
  port: 5432,
});

var helper = require("./helper");

const getTypes = (req, res) => {
  let queryParams = "";
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

  let query = "SELECT * FROM data_type";

  let i = 0;
  if (filters.length > 0) {
    query += " WHERE";

    for (; i < filters.length; i++) {
      switch (filters[i].name) {
        case "string":
          query += ` AND string_type = $${i + 1}`;
          args.push(req.query.string);
          break;

        case "integer":
          query += ` AND integer_type = $${i + 1}`;
          args.push(req.query.integer);
          break;

        case "float":
          query += ` AND float_type = $${i + 1}`;
          args.push(req.query.float);
          break;

        case "boolean":
          query += ` AND boolean_type = $${i + 1}`;
          args.push(req.query.boolean);
          break;

        case "startdate":
          query += ` AND date_type >= $${i + 1}`;
          args.push(req.query.startdate);
          break;

        case "enddate":
          query += ` AND date_type <= $${i + 1}`;
          args.push(req.query.enddate);
          break;

        default:
          break;
      }
    }

    query = query.replace(" AND", "");
  }

  let order = req.query.order;
  if (req.query.sort) {
    switch (req.query.order) {
      case "asc":
        query += ` ORDER BY ${req.query.sort} desc LIMIT 3 OFFSET $${i + 1}`;
        order = "desc";
        break;
      case "desc":
        query += ` ORDER BY id LIMIT 3 OFFSET $${i + 1}`;
        order = "";
        break;
      default:
        query += ` ORDER BY ${req.query.sort} asc LIMIT 3 OFFSET $${i + 1}`;
        order = "asc";
        break;
    }
  } else {
    query += ` ORDER BY id LIMIT 3 OFFSET $${i + 1}`;
  }

  countRows(query, args, i + 1, (err, totalRow) => {
    if (err) {
      throw err;
    }

    pagination.totalPage = Math.ceil(totalRow / pagination.perPage);
    queryParams = req.url;
  });

  pool.query(query, [...args, pagination.offset], (err, results) => {
    if (err) {
      throw err;
    }

    res.render("index", {
      data: results.rows,
      pagination,
      helper,
      queryParams,
      filters,
      order,
    });
  });
};

function countRows(query, args, indexParam, next) {
  query = query.replace("*", "COUNT(*) as total");
  query = query.slice(0, query.indexOf("ORDER"));

  pool.query(query, [...args], (err, results) => {
    if (err) {
      throw err;
    }
    next(err, results.rows[0].total);
  });
}

const getAddForm = (req, res) => {
  res.render("add", {
    data: {
      page: "add",
    },
  });
};

const getTypeById = (req, res) => {
  const id = parseInt(req.params.id);
  let query = `SELECT * FROM data_type WHERE id = $1`;

  pool.query(query, [id], (err, results) => {
    if (err) {
      throw err;
    }
    results.rows[0].date_type = results.rows[0].date_type
      ? results.rows[0].date_type.toISOString().slice(0, 10)
      : "";
    res.render("edit", { data: results.rows[0] });
  });
};

const addTypes = (req, res) => {
  let dateArr = req.body.date.split("-");
  let newDate = [dateArr[2], dateArr[1], dateArr[0]].join("-");
  newDate.slice(0);

  const dataType = [
    req.body.string,
    req.body.integer == "" ? null : parseInt(req.body.integer),
    req.body.float == "" ? NaN : parseFloat(req.body.float),
    newDate !== "--" ? new Date(newDate) : null,
    req.body.boolean == "true" ? true : false,
  ];

  let query = `INSERT INTO data_type (
    string_type, 
    integer_type, 
    float_type, 
    date_type, 
    boolean_type) 
  VALUES
    ($1, $2, $3, $4, $5)`;

  pool.query(query, dataType, (err, result) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
};

const updateType = (req, res) => {
  const id = parseInt(req.params.id);
  const dataType = [
    req.body.string,
    req.body.integer == "" ? null : parseInt(req.body.integer),
    parseFloat(req.body.float),
    req.body.date ? req.body.date : null,
    req.body.boolean == "true" ? true : false,
    id,
  ];
  let query = `UPDATE data_type SET
    string_type = $1, 
    integer_type = $2, 
    float_type = $3, 
    date_type = $4, 
    boolean_type = $5 
  WHERE id = $6
  `;

  pool.query(query, dataType, (err, results) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
};

const deleteType = (req, res) => {
  const id = parseInt(req.params.id);
  let query = `DELETE FROM data_type WHERE id = $1`;

  pool.query(query, [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
};

module.exports = {
  getTypes,
  getTypeById,
  getAddForm,
  addTypes,
  updateType,
  deleteType,
};
