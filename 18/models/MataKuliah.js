export default class MataKuliah {
  constructor(db) {
    this.db = db;
  }

  getAll(next) {
    let sql = `SELECT * FROM matakuliah`;
    this.db.all(sql, [], (err, rows) => {
      next(err, rows);
    });
  }

  getSubjectByID(id_mk, next) {
    let sql = `SELECT * FROM matakuliah WHERE id_mk=?`;
    this.db.all(sql, [id_mk], (err, rows) => {
      next(err, rows);
    });
  }

  add(nama, sks, id_jurusan, next) {
    let sql = `INSERT INTO matakuliah(nama, sks, id_jurusan) VALUES(?, ?, ?)`;
    this.db.run(sql, [nama, sks, id_jurusan], (err) => {
      next(err);
    });
  }

  deleteSubjectByID(id_mk, next) {
    let sql = `DELETE FROM matakuliah WHERE id_mk=?`;
    this.db.run(sql, id_mk, (err) => {
      next(err);
    });
  }
}
