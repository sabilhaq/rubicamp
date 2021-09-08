export default class User {
  constructor(db) {
    this.db = db;
  }

  getUserByUsername(username, next) {
    this.db.all(
      `SELECT * FROM users WHERE username=?`,
      [username],
      (err, rows) => {
        next(err, rows);
      }
    );
  }
}
