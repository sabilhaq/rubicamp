export default class Jurusan {
  constructor(db) {
    this.db = db;
  }

  getAll(next) {
    let sql = `SELECT * FROM jurusan`;
    this.db.all(sql, [], (err, rows) => {
      next(err, rows);
    });
  }

  getMajorByID(majorID, next) {
    let sql = `SELECT * FROM jurusan WHERE id_jurusan=?`;
    this.db.all(sql, [majorID], (err, rows) => {
      next(err, rows);
    });
  }

  add(majorName, next) {
    let sql = `INSERT INTO jurusan(namajurusan) VALUES(?)`;
    this.db.run(sql, [majorName], (err) => {
      next(err);
    });
  }

  deleteMajorByID(majorID, next) {
    let sql = `DELETE FROM jurusan WHERE id_jurusan=?`;
    this.db.run(sql, majorID, (err) => {
      next(err);
    });
  }
}
