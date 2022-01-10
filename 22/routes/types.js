var expres = require('express');
const { ObjectId } = require('mongodb');
var router = expres.Router();
const Response = require('../models/Response');

module.exports = function (db) {
  const collection = db.collection('breads');
  router.get('/', async function (req, res, next) {
    try {
      const field = ['_id', 'string', 'integer', 'float', 'date', 'boolean'];

      const sortBy = field.includes(req.query.sortBy) ? req.query.sortBy : '_id';
      const sortMode = req.query.sortMode === 'desc' ? -1 : 1;

      req.query.sortBy = sortBy;
      req.query.sortMode = sortMode === -1 ? 'desc' : 'asc';

      const {
        _idcheck,
        stringcheck,
        integercheck,
        floatcheck,
        datecheck,
        booleancheck,
        _id,
        string,
        integer,
        float,
        startdate,
        enddate,
        boolean,
      } = req.query;

      let query = {};

      if (_idcheck && _id) {
        query[_id] = _id;
      }

      if (stringcheck && string) {
        query[string] = { $regex: string, $options: 'i' };
      }

      if (integercheck && integer) {
        query[integer] = integer;
      }

      if (floatcheck && float) {
        query[float] = float;
      }

      if (datecheck && startdate && enddate) {
        query[date] = {
          $gte: ISODate(startdate),
          $lt: ISODate(enddate),
        };
      } else if (datecheck && startdate) {
        query[date] = {
          $gte: ISODate(startdate),
        };
      } else if (datecheck && enddate) {
        query[date] = {
          $lt: ISODate(enddate),
        };
      }

      if (booleancheck && boolean) {
        query[boolean] = boolean;
      }

      const page = req.query.page || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      const totalResult = await collection.count(query);
      const pages = Math.ceil(totalResult / limit);

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

  router.post('/', async function (req, res, next) {
    try {
      const { string, integer, float, date, boolean } = req.body;
      const data = await collection.insertOne({
        string,
        integer: Number(integer),
        float: Number(float),
        date: date ? new Date(date) : null,
        boolean: boolean == 'true' ? true : false,
      });
      const item = await collection.findOne({ _id: data.insertedId });
      res.json(new Response(item));
    } catch (err) {
      console.log(err.stack);
      res.json(new Response(null, 'something went wrong'));
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const data = await collection.findOne({ _id: ObjectId(req.params.id) });
      res.json(new Response(data));
    } catch (err) {
      console.log(err.stack);
      res.json(new Response(null, 'data not found'));
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const { string, integer, float, date, boolean } = req.body;
      const data = await collection.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            string,
            integer: Number(integer),
            float: Number(float),
            date: date ? new Date(date) : null,
            boolean: boolean == 'true' ? true : false,
          },
        },
        { upsert: false, returnNewDocument: true }
      );
      res.json(new Response(data.value));
    } catch (err) {
      console.log(err.stack);
      res.json(new Response(null, 'something went wrong'));
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const data = await collection.findOneAndDelete({ _id: ObjectId(req.params.id) });
      res.json(new Response(data.value));
    } catch (err) {
      console.log(err.stack);
      res.json(new Response(null, 'something went wrong'));
    }
  });

  return router;
};
