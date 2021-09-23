var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    console.log("req url:", req.url);
    console.log("req query:", req.query);
    console.log("req body:", req.body);
    console.log("req session:", req.session.user);

    // INIT VARIABLES
    // let column = {};
    let queryFilter = ``;
    let query = ``;
    let queryMember = `SELECT firstname FROM users`;
    let queryConfig = `SELECT projectsconfig FROM users WHERE userid = $1`;
    let pagination = {
      totalPage: 1,
      currentPage: 1,
      perPage: 3,
      offset: 0,
      param: "",
    };

    pagination.currentPage = parseInt(req.query.page ? req.query.page : 1);
    pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

    // OPTIONS COLUMN
    // if (req.query.projectidcolumn) {
    //   column.projectid = true;
    // }
    // if (req.query.namecolumn) {
    //   column.name = true;
    // }
    // if (req.query.membercolumn) {
    //   column.member = true;
    // }
    // OPTIONS COLUMN

    // FILTER
    [queryFilter, args, i] = helper.filterQueryParam(req.query, queryFilter);
    // console.log("queryFilter:", queryFilter);
    console.log("args:", args);
    // FILTER

    query = `SELECT * FROM (
      SELECT projects.projectid, name, STRING_AGG (firstname, ', ') AS "member"
      FROM projects
      LEFT JOIN members ON members.projectid = projects.projectid
      LEFT JOIN users ON users.userid = members.userid
      GROUP BY projects.projectid
      ORDER BY projects.projectid
      ) as projectmember`;

    let queryTotalData = `SELECT COUNT(*) as totaldata FROM (
    SELECT projects.projectid, name, STRING_AGG (firstname, ', ') AS "member"
    FROM projects 
    LEFT JOIN members ON members.projectid = projects.projectid
    LEFT JOIN users ON users.userid = members.userid
    GROUP BY projects.projectid
    ORDER BY projects.projectid
    ) as TES`;

    if (queryFilter) {
      query += ` WHERE` + queryFilter;
      queryTotalData += ` WHERE` + queryFilter;
    }

    // Add limit and offset to main query
    query += ` LIMIT 3 OFFSET $${i + 1}`;

    console.log("query:", query);
    // Check total all data filterd for pagination.totalpage
    db.query(queryConfig, [req.session.user.userid], (err, results) => {
      if (err) {
        throw err;
      }

      console.log("tesnow:", results.rows[0].projectsconfig);
      let config = {};

      results.rows[0].projectsconfig.forEach((column) => {
        switch (column) {
          case "projectid":
            config.projectidcolumn = "projectid";
            break;
          case "name":
            config.namecolumn = "name";
            break;
          case "member":
            config.membercolumn = "member";
            break;

          default:
            break;
        }
      });
      [projectidcolumn, namecolumn, membercolumn] =
        results.rows[0].projectsconfig;
      console.log("confignih:", config);

      db.query(queryTotalData, [...args], (err, results) => {
        if (err) {
          throw err;
        }

        pagination.totalPage = Math.ceil(
          results.rows[0].totaldata / pagination.perPage
        );
        // query for all users for member option select
        db.query(queryMember, [], (err, members) => {
          if (err) {
            throw err;
          }

          let memberOptions = [];
          members.rows.forEach((item) => {
            memberOptions.push(item.firstname);
          });
          // main query for projects list data combine the members
          db.query(query, [...args, pagination.offset], (err, results) => {
            if (err) {
              throw err;
            }

            let queryPage = "?page=";
            let queryParam = req.url.slice(8);
            let queryParamObj = req.query;

            console.log("db result:", results.rows);
            console.log("pagination:", pagination);
            console.log("queryParam:", queryParam);
            console.log("queryPage:", queryPage);

            res.render("projects/list", {
              title: "PMS Projects",
              data: results.rows,
              memberOptions,
              queryParamObj,
              queryParam,
              queryPage,
              pagination,
              config,
            });
          });
        });
      });
    });
  });

  router.post("/option", helper.isLoggedIn, function (req, res, next) {
    console.log("req url:", req.url);
    console.log("req query:", req.query);
    console.log("req body:", req.body);
    console.log("req session:", req.session.user);

    let args = [];
    let query = `UPDATE users SET projectsconfig = $1 WHERE userid = $2`;
    if (req.body.projectidcolumn) {
      args.push("projectid");
    }
    if (req.body.namecolumn) {
      args.push("name");
    }
    if (req.body.membercolumn) {
      args.push("member");
    }
    console.log("query:", query);
    console.log("args:", args);
    db.query(query, [args, req.session.user.userid], (err) => {
      if (err) {
        throw err;
      }
      // res.redirect("/");
      res.redirect("/projects");
    });
  });

  router.get("/add", helper.isLoggedIn, function (req, res, next) {
    let queryMember = `SELECT userid, firstname FROM users`;

    db.query(queryMember, [], (err, members) => {
      if (err) {
        throw err;
      }

      let memberOptions = [];
      members.rows.forEach((item) => {
        memberOptions.push({ userid: item.userid, firstname: item.firstname });
      });

      res.render("projects/add", { title: "PMS Projects Form", memberOptions });
    });
  });

  router.post("/add", helper.isLoggedIn, function (req, res, next) {
    if (req.body.name) {
      console.log("req body:", req.body);
      console.log("name ada ga:", req.body.name);
      console.log("req url:", req.url);
      console.log("req query:", req.query);

      let queryProject = `INSERT INTO projects (name) VALUES ($1) RETURNING projectid`;

      db.query(queryProject, [req.body.name], (err, results) => {
        if (err) {
          throw err;
        }

        let projectid = results.rows[0].projectid;
        console.log("projectid masuk db:", projectid);

        let valuesQuery = "";
        let valuesQueryArr = [];
        let valuesArg = [];
        let i = 1;
        for (const userid in req.body) {
          if (!isNaN(parseInt(userid))) {
            valuesArg.push(parseInt(userid), projectid);
            valuesQueryArr.push(`($${i}, $${i + 1})`);
            i += 2;
          }
        }
        valuesQuery = valuesQueryArr.join(", ");
        console.log("valuesQuery:", valuesQuery);
        console.log("valuesArg:", valuesArg);

        let queryMember = `INSERT INTO members(userid, projectid) VALUES ${valuesQuery}`;
        db.query(queryMember, [...valuesArg], (err) => {
          if (err) {
            throw err;
          }
          res.redirect("/projects");
        });
      });
    }
  });

  router.get("/edit/:id", helper.isLoggedIn, function (req, res, next) {
    const id = parseInt(req.params.id);
    let queryMember = `SELECT userid, firstname FROM users`;

    db.query(queryMember, [], (err, members) => {
      if (err) {
        throw err;
      }

      let memberOptions = [];
      members.rows.forEach((item) => {
        memberOptions.push({ userid: item.userid, firstname: item.firstname });
      });

      let queryEditForm = `SELECT * FROM (
        SELECT projects.projectid, name, STRING_AGG (firstname, ', ') AS "members"
        FROM projects
        LEFT JOIN members ON members.projectid = projects.projectid
        LEFT JOIN users ON users.userid = members.userid
        GROUP BY projects.projectid
        ORDER BY projects.projectid
        ) as projectmember
        WHERE projectid = $1`;
      db.query(queryEditForm, [id], (err, results) => {
        if (err) {
          throw err;
        }

        console.log("tes:", results.rows[0]);

        res.render("projects/edit", {
          title: "PMS Projects Form",
          project: results.rows[0],
          memberOptions,
        });
      });
    });
  });

  router.post("/edit/:id", helper.isLoggedIn, function (req, res, next) {
    console.log("req body:", req.body);
    console.log("name ada ga:", req.body.name);
    console.log("req url:", req.url);
    console.log("req query:", req.query);

    const id = parseInt(req.params.id);
    console.log("projectid:", id);
    let queryDelete = `DELETE FROM members WHERE projectid = $1`;
    // let queryProject = `INSERT INTO projects (name) VALUES ($1) RETURNING projectid`;

    db.query(queryDelete, [id], (err, results) => {
      if (err) {
        throw err;
      }

      let queryEdit = `UPDATE projects SET name = $1 WHERE projectid = $2 RETURNING projectid`;

      db.query(queryEdit, [req.body.name, id], (err, results) => {
        if (err) {
          throw err;
        }

        let projectid = results.rows[0].projectid;
        console.log("projectid masuk db:", projectid);

        let valuesQuery = "";
        let valuesQueryArr = [];
        let valuesArg = [];
        let i = 1;
        for (const userid in req.body) {
          if (!isNaN(parseInt(userid))) {
            valuesArg.push(parseInt(userid), projectid);
            valuesQueryArr.push(`($${i}, $${i + 1})`);
            i += 2;
          }
        }
        valuesQuery = valuesQueryArr.join(", ");
        console.log("valuesQuery:", valuesQuery);
        console.log("valuesArg:", valuesArg);

        if (valuesQuery) {
          let queryMember = `INSERT INTO members(userid, projectid) VALUES ${valuesQuery}`;
          db.query(queryMember, [...valuesArg], (err) => {
            if (err) {
              throw err;
            }
            res.redirect("/projects");
          });
        } else {
          res.redirect("/projects");
        }
      });
    });
  });

  router.get("/delete/:id", helper.isLoggedIn, function (req, res, next) {
    const id = parseInt(req.params.id);
    let query = `DELETE FROM projects WHERE projectid = $1`;

    db.query(query, [id], (err, results) => {
      if (err) {
        throw err;
      }
      res.redirect("/projects");
    });
  });

  return router;
};
