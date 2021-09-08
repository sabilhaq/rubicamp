export default class Kontrak {
  constructor(db) {
    this.db = db;
  }

  getAll(next) {
    let sql = `SELECT * FROM kontrak`;
    this.db.all(sql, [], (err, rows) => {
      next(err, rows);
    });
  }

  getContractByID(id_kontrak, next) {
    let sql = `SELECT * FROM kontrak WHERE id_kontrak=?`;
    this.db.all(sql, [id_kontrak], (err, rows) => {
      next(err, rows);
    });
  }

  add(nilai, nim, id_mk, id_dosen, next) {
    let sql = `INSERT INTO kontrak(nilai, nim, id_mk, id_dosen) VALUES(?, ?, ?, ?)`;
    this.db.run(sql, [nilai, nim, id_mk, id_dosen], (err) => {
      next(err);
    });
  }

  deleteContractByID(id_kontrak, next) {
    let sql = `DELETE FROM kontrak WHERE id_kontrak=?`;
    this.db.run(sql, id_kontrak, (err) => {
      next(err);
    });
  }
}
