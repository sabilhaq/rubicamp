import readline from "readline";
import UniversityController from "./controller/controller.js";
import db from "./db/connect.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", () => {
  process.exit(0);
});

let university = new UniversityController(rl, db);
university.start();
