var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('id');

/* GET home page. */
module.exports = function (db) {
  router.get('/', async function (req, res, next) {
    try {
      const field = ['id', 'string', 'integer', 'float', 'date', 'boolean'];

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
      let count = 1;

      if (idcheck && id) {
        params.push(`id = $${count++}`);
        values.push(id);
      }

      if (stringcheck && string) {
        params.push(`string ilike '%' || $${count++} || '%'`);
        values.push(string);
      }

      if (integercheck && integer) {
        params.push(`integer = $${count++}`);
        values.push(integer);
      }

      if (floatcheck && float) {
        params.push(`float = $${count++}`);
        values.push(float);
      }

      if (datecheck && startdate && enddate) {
        params.push(`date between $${count++} and $${count++}`);
        values.push(startdate);
        values.push(enddate);
      } else if (datecheck && startdate) {
        params.push(`date between $${count++} and (select max(date) from breads)`);
        values.push(startdate);
      } else if (datecheck && enddate) {
        params.push(`date between (select min(date) from breads) and $${count++}`);
        values.push(enddate);
      }

      if (booleancheck && boolean) {
        params.push(`boolean = $${count++}`);
        values.push(boolean);
      }

      const page = req.query.page || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      let sql = 'select count(*) as total from breads';
      if (params.length > 0) {
        sql += ` where ${params.join(' and ')}`;
      }
      const totalResult = await db.query(sql, values);
      const pages = Math.ceil(totalResult.rows[0].total / limit);

      sql = `select * from breads`;
      if (params.length > 0) {
        sql += ` where ${params.join(' and ')}`;
      }
      sql += ` order by ${sortBy} ${sortMode} limit ${limit} offset ${offset}`;

      const data = await db.query(sql, values);
      res.render('index', {
        title: 'Breads',
        data: data.rows,
        moment,
        pagination: {
          page: Number(page),
          pages,
          url,
        },
        query: req.query,
      });
    } catch (err) {
      console.log(err.stack);
    }
  });

  router.get('/add', async function (req, res, next) {
    res.render('form', { title: 'Add Data', data: {}, moment });
  });

  router.post('/add', async function (req, res, next) {
    try {
      const { string, integer, float, date, boolean } = req.body;
      const sql = 'insert into breads(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)';
      await db.query(sql, [string, integer, float, date, boolean]);
      res.redirect('/');
    } catch (err) {
      console.log(err.stack);
    }
  });

  router.get('/edit/:id', async function (req, res, next) {
    try {
      const sql = 'select * from breads where id = $1';
      const data = await db.query(sql, [req.params.id]);
      if (data.rows.length > 0) {
        res.render('form', { title: 'Edit Data', data: data.rows[0], moment });
      } else {
        res.send('data not found');
      }
    } catch (err) {
      console.log(err.stack);
    }
  });

  router.post('/edit/:id', async function (req, res, next) {
    try {
      const { string, integer, float, date, boolean } = req.body;
      const sql = 'update breads set string=$1, integer=$2, float=$3, date=$4, boolean=$5 where id=$6';
      await db.query(sql, [string, integer, float, date, boolean, req.params.id]);
      res.redirect('/');
    } catch (err) {
      console.log(err.stack);
    }
  });

  return router;
};
