import path from "path";
import sqlite3 from "sqlite3";
sqlite3.verbose();

const dbpath = path.join(path.resolve(), "db", "university.db");

const db = new sqlite3.Database(dbpath);

export default db;
