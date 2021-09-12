const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./queries");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", db.getTypes);
app.get("/add", db.getAddForm);
app.post("/add", db.addTypes);
app.get("/edit/:id", db.getTypeById);
app.post("/edit/:id", db.updateType);
app.get("/delete/:id", db.deleteType);

app.listen(port, () => {
  console.log(`Server started (http://localhost:${port}/)`);
});
