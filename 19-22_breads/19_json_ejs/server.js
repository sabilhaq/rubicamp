const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
moment.locale('id');

const app = express();

const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
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

  let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  if (idcheck && id) {
    data = data.filter(item => {
      return item.id == Number(id);
    });
  }

  if (stringcheck && string) {
    data = data.filter(item => {
      return item.string.toLowerCase().includes(string.toLowerCase());
    });
  }

  if (integercheck && integer) {
    data = data.filter(item => {
      return item.integer == Number(integer);
    });
  }

  if (floatcheck && float) {
    data = data.filter(item => {
      return item.float == Number(float);
    });
  }

  if (datecheck && startdate && enddate) {
    data = data.filter(item => {
      return item.date >= startdate && item.date <= enddate;
    });
  } else if (datecheck && startdate) {
    data = data.filter(item => {
      return item.date >= startdate;
    });
  } else if (datecheck && enddate) {
    data = data.filter(item => {
      return item.date <= enddate;
    });
  }

  if (booleancheck && boolean) {
    data = data.filter(item => {
      return item.boolean == (boolean === 'true' ? true : false);
    });
  }

  const page = req.query.page || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const pages = Math.ceil(data.length / limit);

  switch (sortMode) {
    case 'desc':
      if (sortBy == 'string' || sortBy == 'date') {
        data.sort(function (a, b) {
          let x = a[sortBy].toLowerCase();
          let y = b[sortBy].toLowerCase();
          if (x > y) {
            return -1;
          }
          if (x < y) {
            return 1;
          }
          return 0;
        });
      } else {
        data.sort(function (a, b) {
          return b[sortBy] - a[sortBy];
        });
      }
      break;
    case 'asc':
      if (sortBy == 'string' || sortBy == 'date') {
        data.sort(function (a, b) {
          let x = a[sortBy].toLowerCase();
          let y = b[sortBy].toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
      } else {
        data.sort(function (a, b) {
          return a[sortBy] - b[sortBy];
        });
      }
      break;

    default:
      break;
  }

  data = data.slice(offset, offset + limit);

  res.render('index', {
    title: 'Breads',
    data,
    moment,
    pagination: {
      page: Number(page),
      pages,
      offset,
      url,
    },
    query: req.query,
  });
});

app.get('/add', (req, res) => res.render('form', { title: 'Add Data', data: {} }));

app.post('/add', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  const maxId = Math.max.apply(Math, data.map(function (o) { return o.id; }))
  data.push({
    id: maxId + 1,
    string: req.body.string,
    integer: Number(req.body.integer),
    float: Number(req.body.float),
    date: req.body.date,
    boolean: req.body.boolean === 'true' ? true : false,
  });
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  data = data.find(item => {
    return item.id == req.params.id;
  });
  res.render('form', { title: 'Edit Data', data, moment });
});

app.post('/edit/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  index = data.findIndex(item => {
    return item.id == req.params.id;
  });
  data[index].string = req.body.string;
  data[index].integer = Number(req.body.integer);
  data[index].float = Number(req.body.float);
  data[index].date = req.body.date;
  data[index].boolean = req.body.boolean === 'true' ? true : false;
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  data = data.filter(item => {
    return item.id != req.params.id;
  });
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.redirect('/');
});

app.listen(port, () => console.log(`Listening on port ${port}. Click: http://localhost:3000`));
