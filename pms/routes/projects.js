var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    // INIT VARIABLES
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

    // FILTER
    [queryFilter, args, i] = helper.filterQueryParamProjects(
      req.query,
      queryFilter
    );

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
      ) as projectmember`;

    if (queryFilter) {
      query += ` WHERE` + queryFilter;
      queryTotalData += ` WHERE` + queryFilter;
    }

    // Add limit and offset to main query
    query += ` LIMIT 3 OFFSET $${i + 1}`;

    // Check total all data filterd for pagination.totalpage
    db.query(queryConfig, [req.session.user.userid], (err, results) => {
      if (err) {
        throw err;
      }

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

            res.render("projects/list", {
              title: "PMS Projects",
              data: results.rows,
              memberOptions,
              queryParamObj,
              pagination,
              queryParam,
              queryPage,
              config,
            });
          });
        });
      });
    });
  });

  router.post("/option", helper.isLoggedIn, function (req, res, next) {
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
    db.query(query, [args, req.session.user.userid], (err) => {
      if (err) {
        throw err;
      }
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
      let queryProject = `INSERT INTO projects (name) VALUES ($1) RETURNING projectid`;

      db.query(queryProject, [req.body.name], (err, results) => {
        if (err) {
          throw err;
        }

        let projectid = results.rows[0].projectid;

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

        res.render("projects/edit", {
          title: "PMS Projects Form",
          project: results.rows[0],
          memberOptions,
        });
      });
    });
  });

  router.post("/edit/:id", helper.isLoggedIn, function (req, res, next) {
    const id = parseInt(req.params.id);
    let queryDelete = `DELETE FROM members WHERE projectid = $1`;

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

  // Overview
  router.get(
    "/:projectid/overview",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      let tabActive = "overview";
      let queryProject = `SELECT * FROM projects WHERE projectid = $1`;

      db.query(queryProject, [projectid], (err, results) => {
        if (err) {
          throw err;
        }

        let projectName = results.rows[0].name;
        let queryMember = `SELECT members.userid, firstname FROM members
        LEFT JOIN users ON users.userid = members.userid
        WHERE projectid = $1`;

        db.query(queryMember, [projectid], (err, results) => {
          if (err) {
            throw err;
          }

          let memberList = [];
          results.rows.forEach((item) => {
            memberList.push({
              userid: item.userid,
              firstname: item.firstname,
            });
          });

          let queryIssue = `SELECT issueid, tracker, status 
            FROM issues WHERE projectid = $1`;
          db.query(queryIssue, [projectid], (err, results) => {
            if (err) {
              throw err;
            }

            let openBugs = [];
            let openFeatures = [];
            let openSupports = [];
            let allBugs = [];
            let allFeatures = [];
            let allSupports = [];

            results.rows.forEach((issue) => {
              switch (issue.tracker) {
                case "bug":
                  allBugs.push(issue);
                  if (issue.status != "Closed") {
                    openBugs.push(issue);
                  }
                  break;
                case "feature":
                  allFeatures.push(issue);
                  if (issue.status != "Closed") {
                    openFeatures.push(issue);
                  }
                  break;
                case "support":
                  allSupports.push(issue);
                  if (issue.status != "Closed") {
                    openSupports.push(issue);
                  }
                  break;

                default:
                  break;
              }
            });

            res.render("projects/overview/view", {
              title: "Project Overview",
              tabActive,
              projectid,
              projectName,
              memberList,
              openBugs,
              openFeatures,
              openSupports,
              allBugs,
              allFeatures,
              allSupports,
            });
          });
        });
      });
    }
  );

  router.get(
    "/:projectid/members",
    helper.isLoggedIn,
    function (req, res, next) {
      // INIT VARIABLES
      let queryFilter = ``;
      let queryConfig = `SELECT membersconfig FROM users WHERE userid = $1`;
      let subqueryTotalData = `SELECT members.userid, firstname, role 
        FROM members
        LEFT JOIN users ON users.userid = members.userid`;

      let query = ``;
      const projectid = parseInt(req.params.projectid);
      let queryParamObj = req.query;
      let queryPage = "?page=";
      let queryParam = "";
      let tabActive = "members";
      let config = {};
      let pagination = {
        totalPage: 1,
        currentPage: 1,
        perPage: 3,
        offset: 0,
        param: "",
      };

      pagination.currentPage = parseInt(req.query.page ? req.query.page : 1);
      pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

      // FILTER
      [queryFilter, args, i] = helper.filterQueryParamMembers(
        req.query,
        queryFilter,
        projectid
      );

      query = `SELECT members.userid, firstname, role FROM members
        LEFT JOIN users ON users.userid = members.userid`;

      if (queryFilter) {
        query += ` WHERE` + queryFilter;
        subqueryTotalData += ` WHERE` + queryFilter;
      }

      let queryTotalData = `SELECT COUNT(*) as totaldata FROM (${subqueryTotalData}) as members`;

      // Add limit and offset to main query
      query += ` ORDER BY users.userid`;
      query += ` LIMIT 3 OFFSET $${i + 1}`;

      db.query(queryConfig, [req.session.user.userid], (err, results) => {
        if (err) {
          throw err;
        }

        results.rows[0].membersconfig.forEach((column) => {
          switch (column) {
            case "userid":
              config.useridcolumn = "userid";
              break;
            case "firstname":
              config.firstnamecolumn = "firstname";
              break;
            case "position":
              config.positioncolumn = "position";
              break;
            default:
              break;
          }
        });
        db.query(queryTotalData, [...args], (err, results) => {
          if (err) {
            throw err;
          }

          pagination.totalPage = Math.ceil(
            results.rows[0].totaldata / pagination.perPage
          );

          db.query(query, [...args, pagination.offset], (err, results) => {
            if (err) {
              throw err;
            }

            res.render("projects/members/list", {
              title: "Project Members",
              data: results.rows,
              queryParamObj,
              queryParam,
              pagination,
              queryPage,
              projectid,
              tabActive,
              config,
            });
          });
        });
      });
    }
  );

  router.post("/members/option", helper.isLoggedIn, function (req, res, next) {
    let args = [];
    let query = `UPDATE users SET membersconfig = $1 WHERE userid = $2`;
    if (req.body.useridcolumn) {
      args.push("userid");
    }
    if (req.body.firstnamecolumn) {
      args.push("firstname");
    }
    if (req.body.positioncolumn) {
      args.push("position");
    }
    db.query(query, [args, req.session.user.userid], (err) => {
      if (err) {
        throw err;
      }
      res.redirect(`/projects/${req.body.projectid}/members`);
    });
  });

  router.get(
    "/:projectid/members/add",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = req.params.projectid;
      let query = `SELECT users.userid, users.firstname FROM users
        WHERE users.userid NOT IN (
          SELECT users.userid FROM users
          LEFT JOIN members ON members.userid = users.userid
          WHERE projectid = $1
        )`;

      db.query(query, [projectid], (err, results) => {
        if (err) {
          throw err;
        }

        res.render("projects/members/add", {
          title: "Project Member Add",
          memberOptions: results.rows,
        });
      });
    }
  );

  router.post(
    "/:projectid/members/add",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = req.params.projectid;
      let queryAddMember = `INSERT INTO members (userid, role, projectid) 
        VALUES ($1, $2, $3) 
        RETURNING projectid`;

      db.query(
        queryAddMember,
        [req.body.member, req.body.position, projectid],
        (err, results) => {
          if (err) {
            throw err;
          }

          const projectid = results.rows[0].projectid;
          res.redirect(`/projects/${projectid}/members`);
        }
      );
    }
  );

  router.get(
    "/:projectid/members/edit/:userid",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const userid = parseInt(req.params.userid);
      let queryMember = `SELECT users.userid, users.firstname, members.role, projectid
        FROM users
        LEFT JOIN members ON members.userid = users.userid
        WHERE projectid = $1 AND users.userid = $2`;
      db.query(queryMember, [projectid, userid], (err, results) => {
        if (err) {
          throw err;
        }

        res.render("projects/members/edit", {
          title: "PMS Project Member Edit",
          member: results.rows[0],
        });
      });
    }
  );

  router.post(
    "/:projectid/members/edit/:userid",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const userid = parseInt(req.params.userid);

      let queryEdit = `UPDATE members SET role = $1 
        WHERE projectid = $2 AND userid = $3 
        RETURNING projectid`;

      db.query(
        queryEdit,
        [req.body.position, projectid, userid],
        (err, results) => {
          if (err) {
            throw err;
          }
          const projectid = results.rows[0].projectid;
          res.redirect(`/projects/${projectid}/members`);
        }
      );
    }
  );

  router.get(
    "/:projectid/members/delete/:userid",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const userid = parseInt(req.params.userid);
      let query = `DELETE FROM members WHERE userid = $1`;

      db.query(query, [userid], (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect(`/projects/${projectid}/members`);
      });
    }
  );

  return router;
};
