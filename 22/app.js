var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { MongoClient } = require("mongodb");

async function main() {
  const url = "mongodb://localhost:27017";
  const client = new MongoClient(url);

  const dbName = "breaddb";

  await client.connect();
  console.log("Connected successfully to server (http://localhost:3000)");
  const db = client.db(dbName);

  return db;
}

main()
  .then((db) => {
    var indexRouter = require("./routes/index");
    var typesRouter = require("./routes/types")(db);

    var app = express();

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/", indexRouter);
    app.use("/types", typesRouter);

    app.use(function (req, res, next) {
      next(createError(404));
    });

    app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      res.status(err.status || 500);
      res.render("error");
    });

    var debug = require("debug")("cobaajax:server");
    var http = require("http");

    var port = normalizePort(process.env.PORT || "3000");
    app.set("port", port);

    var server = http.createServer(app);

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        return val;
      }

      if (port >= 0) {
        return port;
      }

      return false;
    }

    function onError(error) {
      if (error.syscall !== "listen") {
        throw error;
      }

      var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    function onListening() {
      var addr = server.address();
      var bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
      debug("Listening on " + bind);
    }
  })
  .catch((err) => {
    console.error("terjadi kesalahan", err);
  });
