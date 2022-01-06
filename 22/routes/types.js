var expres = require('express');
var router = expres.Router();
const Response = require('../models/Response');

module.exports = function (db) {
  const collection = db.collection('data-type');
  router.get('/', async function (req, res, next) {
    try {
      const field = ['id', 'string', 'integer', 'float', 'date', 'boolean'];

      const sortBy = field.includes(req.query.sortBy) ? req.query.sortBy : 'id';
      // const sortMode = req.query.sortMode === 'desc' ? 'desc' : 'asc';
      let sortMode = req.query.sortMode === 'desc' ? 'desc' : 'asc';

      req.query.sortBy = sortBy;
      req.query.sortMode = sortMode;
      sortMode = req.query.sortMode === 'desc' ? -1 : 1;

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

      // let params = [];
      // let values = [];
      // let values = {};
      let query = {};
      // let count = 1;

      if (id) {
        query[id] = id;
      }

      if (string) {
        // params.push(`name ilike '%' || $${count++} || '%'`);
        // values.push(name);

        // query[string] = string;
        query[string] = { '$regex': string, '$options': 'i' }
      }

      if (integer) {
        query[integer] = integer;
      }

      if (float) {
        query[float] = float;
      }

      if (startdate && enddate) {
        // params.push(`date between $${count++} and $${count++}`);
        // values.push(startdate);
        // values.push(enddate);

        query[date] = {
          $gte: ISODate(startdate),
          $lt: ISODate(enddate),
        };
      } else if (startdate) {
        // params.push(`date between $${count++} and (select max(date) from breads)`);
        // values.push(startdate);

        query[date] = {
          $gte: ISODate(startdate),
        };
      } else if (enddate) {
        // params.push(`date between (select min(date) from breads) and $${count++}`);
        // values.push(enddate);

        query[date] = {
          $lt: ISODate(enddate),
        };
      }

      if (boolean) {
        // params.push(`boolean = $${count++}`);
        // values.push(boolean);

        query[boolean] = boolean;
      }

      const page = req.query.page || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      // let sql = 'select count(*) as total from breads';
      // if (params.length > 0) {
      //   sql += ` where ${params.join(' and ')}`;
      // }
      const totalResult = await collection.count(query);
      const pages = Math.ceil(totalResult / limit);

      // sql = `select * from breads`;
      // if (params.length > 0) {
      //   sql += ` where ${params.join(' and ')}`;
      // }
      // sql += ` order by ${sortBy} ${sortMode} limit ${limit} offset ${offset}`;

      const data = await collection
        .find(query)
        .skip(offset)
        .limit(limit)
        .sort({ [sortBy]: sortMode })
        .toArray();
      res.json(
        new Response({
          rows: data,
          page: Number(page),
          pages,
        })
      );
    } catch (err) {
      console.log(err.stack);
      res.json(new Response(null, 'something went wrong'));
    }
  });

  // router.get('/', async function (req, res, next) {
  //   try {
  //     // Variables
  //     let order;
  //     let data = {};
  //     let query = {};
  //     let sort = {};
  //     let pagination = {
  //       totalData: 0,
  //       totalPage: 3,
  //       currentPage: 1,
  //       perPage: 3,
  //       offset: 0,
  //     };
  //     let filters = [];

  //     // Filter
  //     if (req.query._id) {
  //       filters.push({ name: '_id', value: parseInt(req.query._id) });
  //       query._id = parseInt(req.query._id);
  //     }
  //     if (req.query.string) {
  //       filters.push({ name: 'string', value: req.query.string });
  //       query.string_type = req.query.string;
  //     }
  //     if (req.query.integer) {
  //       filters.push({ name: 'integer', value: Number(req.query.integer) });
  //       query.integer_type = parseInt(req.query.integer);
  //     }
  //     if (req.query.float) {
  //       filters.push({ name: 'float', value: parseFloat(req.query.float) });
  //       query.float_type = parseFloat(req.query.float);
  //     }
  //     if (req.query.boolean) {
  //       filters.push({
  //         name: 'boolean',
  //         value: req.query.boolean == 'true' ? true : false,
  //       });
  //       query.boolean_type = req.query.boolean == 'true' ? true : false;
  //     }
  //     if (req.query.startdate && req.query.enddate) {
  //       filters.push({ name: 'startdate', value: req.query.startdate });
  //       filters.push({ name: 'enddate', value: req.query.enddate });

  //       query.date_type = {
  //         $gte: new Date(req.query.startdate),
  //         $lte: new Date(req.query.enddate),
  //       };
  //     }

  //     // Pagination
  //     pagination.totalData = await collection.count(query);
  //     pagination.totalPage = Math.ceil(pagination.totalData / pagination.perPage);
  //     pagination.totalPage = pagination.totalPage ? pagination.totalPage : 1;
  //     pagination.currentPage = Number(req.query.page ? req.query.page : 1);
  //     pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

  //     // Sort
  //     switch (req.query.order) {
  //       case 'asc':
  //         order = 1;
  //         break;
  //       case 'desc':
  //         order = -1;
  //         break;
  //       default:
  //         break;
  //     }
  //     if (order) {
  //       switch (req.query.sort) {
  //         case '_id':
  //           sort._id = order;
  //           break;
  //         case 'string_type':
  //           sort.string_type = order;
  //           break;
  //         case 'integer_type':
  //           sort.integer_type = order;
  //           break;
  //         case 'float_type':
  //           sort.float_type = order;
  //           break;
  //         case 'date_type':
  //           sort.date_type = order;
  //           break;
  //         case 'boolean_type':
  //           sort.boolean_type = order;
  //           break;
  //         default:
  //           break;
  //       }
  //     }

  //     const response = await collection
  //       .find(query)
  //       .skip(pagination.offset)
  //       .limit(pagination.perPage)
  //       .sort(sort)
  //       .toArray();

  //     data.items = response;
  //     data.pagination = pagination;
  //     data.filters = filters;
  //     data.queryParams = req.url;
  //     data.stringparam = req.url.slice(2);
  //     data.order = req.query.order;
  //     data.sort = req.query.sort;

  //     res.json(data);
  //   } catch (err) {
  //     res.status(500).json({ err });
  //   }
  // });

  router.post('/add', async function (req, res, next) {
    try {
      const lastId = await collection.count();
      const obj = {
        _id: lastId + 1,
        string_type: req.body.string_type,
        integer_type: parseInt(req.body.integer_type),
        float_type: parseFloat(req.body.float_type),
        date_type: (req.body.date_type && new Date(req.body.date_type)) || null,
        boolean_type: req.body.boolean_type == 'true' ? true : false,
      };
      const data = await collection.insertOne(obj);
      const item = await collection.findOne({ _id: data.insertedId });
      res.json(item);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.get('/edit/:id', async function (req, res, next) {
    try {
      const item = await collection.findOne({
        _id: parseInt(req.params.id),
      });
      item.date_type = item.date_type ? item.date_type.toISOString().slice(0, 10) : '';
      res.json(item);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.put('/edit/:id', async function (req, res, next) {
    try {
      const data = await collection.updateOne(
        { _id: parseInt(req.params.id) },
        {
          $set: {
            _id: parseInt(req.body._id),
            string_type: req.body.string_type,
            integer_type: parseInt(req.body.integer_type),
            float_type: parseFloat(req.body.float_type),
            date_type: new Date(req.body.date_type),
            boolean_type: req.body.boolean_type == 'true' ? true : false,
          },
        },
        { upsert: false }
      );
      const item = await collection.findOne({
        _id: parseInt(req.params.id),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const item = await collection.findOne({
        _id: parseInt(req.params.id),
      });
      const data = await collection.deleteOne({ _id: parseInt(req.params.id) });
      res.json(item);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  return router;
};
