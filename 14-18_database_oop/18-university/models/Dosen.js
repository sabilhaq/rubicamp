export default class Dosen {
  constructor(db) {
    this.db = db;
  }

  getAll(next) {
    let sql = `SELECT * FROM dosen`;
    this.db.all(sql, [], (err, rows) => {
      next(err, rows);
    });
  }

  getLecturerByID(lecturerID, next) {
    let sql = `SELECT * FROM dosen WHERE id_dosen=?`;
    this.db.all(sql, [lecturerID], (err, rows) => {
      next(err, rows);
    });
  }

  add(name, next) {
    let sql = `INSERT INTO dosen(nama) VALUES(?)`;
    this.db.run(sql, [name], (err) => {
      next(err);
    });
  }

  deleteLecturerByID(lecturerID, next) {
    let sql = `DELETE FROM dosen WHERE id_dosen=?`;
    this.db.run(sql, lecturerID, (err) => {
      next(err);
    });
  }
}
