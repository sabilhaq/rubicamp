export default class Mahasiswa {
  constructor(db) {
    this.db = db;
  }

  getAll(next) {
    let sql = `SELECT nim, nama, alamat, id_jurusan FROM mahasiswa`;
    this.db.all(sql, [], (err, rows) => {
      next(err, rows);
    });
  }

  getStudentByNIM(nim, next) {
    let sql = `SELECT nim, nama, alamat, id_jurusan FROM mahasiswa WHERE nim=?`;
    this.db.all(sql, [nim], (err, rows) => {
      next(err, rows);
    });
  }

  add(nim, name, major, address, next) {
    let sql = `INSERT INTO mahasiswa(nim, nama, alamat, id_jurusan) VALUES(?, ?, ?, ?)`;
    this.db.run(sql, [nim, name, address, major], (err) => {
      next(err);
    });
  }

  deleteStudentByNIM(nim, next) {
    let sql = `DELETE FROM mahasiswa WHERE nim=?`;
    this.db.run(sql, nim, (err) => {
      next(err);
    });
  }
}
