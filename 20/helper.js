const fs = require("fs");

function viewDate(date) {
  let newDate = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  let formatedDate = newDate.toLocaleDateString("id-ID", options);
  return formatedDate;
}

function readFile() {
  let file = fs.readFileSync("data.json", "utf-8");
  var data = JSON.parse(file);
  return data;
}

function writeFile(data) {
  let dataString = JSON.stringify(data);
  fs.writeFileSync("data.json", dataString);
}

function page(filters, i, queryParams) {
  if (filters.length == 0) {
    return `?page=${i}`;
  } else {
    arrQueryParams = queryParams.split("&");
    let formatedQueryParams = "";
    if (arrQueryParams[arrQueryParams.length - 1].search("page") != -1) {
      arrQueryParams.pop();
    }
    formatedQueryParams = arrQueryParams.join("&");
    return formatedQueryParams.concat(`&page=${i}`);
  }
}

function countRows(db, sql, args, next) {
  sql = sql.replace("*", "COUNT(*) as total");
  sql = sql.replace(" ORDER BY id LIMIT 3 OFFSET ?", "");

  db.all(sql, [...args], (err, rows) => {
    next(err, rows[0].total);
  });
}
module.exports = {
  viewDate,
  readFile,
  writeFile,
  page,
  countRows,
};