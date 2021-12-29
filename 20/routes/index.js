var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('id');

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    const field = ['id', 'stringdata', 'integerdata', 'floatdata', 'datedata', 'booleandata'];

    const sortBy = field.includes(req.query.sortBy) ? req.query.sortBy : 'id';
    const sortMode = req.query.sortMode === 'desc' ? 'desc' : 'asc';

    const url = req.url == '/' ? '/?page=1&sortBy=id&sortMode=asc' : req.url;
    req.query.sortBy = sortBy;
    req.query.sortMode = sortMode;

    const {
      idcheck,
      stringcheck,
      integercheck,
      floatcheck,
      datecheck,
      booleancheck,
      id,
      string,
      integer,
      float,
      startdate,
      enddate,
      boolean,
    } = req.query;

    let params = [];
    let values = [];

    if (idcheck && id) {
      params.push('id = ?');
      values.push(id);
    }

    if (stringcheck && string) {
      params.push('stringdata LIKE ?');
      values.push(`%${string}%`);
    }

    if (integercheck && integer) {
      params.push('integerdata = ?');
      values.push(integer);
    }

    if (floatcheck && float) {
      params.push('floatdata = ?');
      values.push(float);
    }

    if (datecheck && startdate && enddate) {
      params.push('datedata <= ? and datedata >= ?');
      values.push(startdate);
      values.push(enddate);
    } else if (datecheck && startdate) {
      params.push('datedata >= ?');
      values.push(startdate);
    } else if (datecheck && enddate) {
      params.push('datedata <= ?');
      values.push(enddate);
    }

    if (booleancheck && boolean) {
      params.push('booleandata = ?');
      values.push(boolean == 'true' ? 1 : 0);
    }

    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    let sql = 'select count(*) as total from breads';
    if (params.length > 0) {
      sql += ` where ${params.join(' and ')}`;
    }

    db.all(sql, values, (err, rows) => {
      const pages = Math.ceil(rows[0].total / limit);

      sql = `select * from breads`;
      if (params.length > 0) {
        sql += ` where ${params.join(' and ')}`;
      }
      sql += ` order by ${sortBy} ${sortMode} limit ${limit} offset ${offset}`;

      db.all(sql, values, (err, rows) => {
        res.render('index', {
          title: 'Breads',
          data: rows,
          moment,
          pagination: {
            page: Number(page),
            pages,
            url,
          },
          query: req.query,
        });
      });
    });
  });

  router.get('/add', async function (req, res, next) {
    res.render('form', { title: 'Add Data', data: {}, moment });
  });

  router.post('/add', async function (req, res, next) {
    const { stringdata, integerdata, floatdata, datedata, booleandata } = req.body;
    const sql =
      'insert into breads(stringdata, integerdata, floatdata, datedata, booleandata) values (?, ?, ?, ?, ?)';
    db.run(
      sql,
      [stringdata, integerdata, floatdata, datedata, booleandata == 'true' ? 1 : 0],
      err => {
        if (err) {
          console.error(err.message);
        }
        res.redirect('/');
      }
    );
  });

  router.get('/edit/:id', async function (req, res, next) {
    const sql = 'select * from breads where id = ?';
    db.all(sql, [req.params.id], (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      if (rows.length > 0) {
        res.render('form', { title: 'Edit Data', data: rows[0], moment });
      } else {
        res.send('data not found');
      }
    });
  });

  router.post('/edit/:id', async function (req, res, next) {
    const { stringdata, integerdata, floatdata, datedata, booleandata } = req.body;
    const sql =
      'update breads set stringdata=?, integerdata=?, floatdata=?, datedata=?, booleandata=? where id=?';
    db.run(
      sql,
      [stringdata, integerdata, floatdata, datedata, booleandata == 'true' ? 1 : 0, req.params.id],
      err => {
        if (err) {
          console.error(err.message);
        }
        res.redirect('/');
      }
    );
  });

  router.get('/delete/:id', async function (req, res, next) {
    try {
      const sql = 'delete from breads where id = ?';
      db.run(sql, req.params.id, err => {
        if (err) {
          console.error(err.message);
        }
        res.redirect('/');
      });
    } catch (err) {
    }
  });

  return router;
};
