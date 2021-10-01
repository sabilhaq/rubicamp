var express = require("express");
var router = express.Router();
var helper = require("../helpers/util");
var path = require("path");
var fs = require("fs");
var moment = require("moment");

module.exports = function (db) {
  router.get("/", helper.isLoggedIn, function (req, res, next) {
    // INIT VARIABLES
    let queryFilter = "";
    let query = "";
    let queryTotalData = "";
    let queryMember = `SELECT userid, firstname FROM users`;
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

    let subquery = `
      SELECT 
        projects.projectid, 
        projects.name, 
        STRING_AGG (firstname, ', ' ORDER BY users.firstname) AS "member",
        STRING_AGG (users.userid::text, ',' ) as userids
      FROM projects
      LEFT JOIN members ON members.projectid = projects.projectid
      LEFT JOIN users ON users.userid = members.userid
      GROUP BY projects.projectid
    `;

    if (queryFilter) {
      subquery += ` HAVING` + queryFilter + ` ORDER BY projects.projectid`;
    }

    query = `SELECT * FROM (${subquery}) as projectmember`;
    queryTotalData = `SELECT COUNT(*) as totaldata 
      FROM (${subquery}) as projectmember
    `;

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
            memberOptions.push({
              userid: item.userid,
              firstname: item.firstname,
            });
          });
          // main query for projects list data combine the members
          db.query(query, [...args, pagination.offset], (err, results) => {
            if (err) {
              throw err;
            }

            let queryPage = "?page=";
            let queryParamObj = req.query;

            res.render("projects/list", {
              title: "PMS Projects",
              data: results.rows,
              memberOptions,
              queryParamObj,
              pagination,
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
        let queryMember = "";
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

        if (valuesQueryArr.length > 0) {
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
        WHERE projectid = $1
      `;
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
    let queryDelete = `DELETE FROM members WHERE projectid = $1 RETURNING projectid`;
    db.query(queryDelete, [id], (err, results) => {
      if (err) {
        throw err;
      }
      let projectid;
      if (results.rows.length > 0) {
        projectid = results.rows[0].projectid;
      } else {
        projectid = id;
      }

      let queryEdit = `UPDATE projects SET name = $1 WHERE projectid = $2 RETURNING projectid`;
      db.query(queryEdit, [req.body.name, projectid], (err, results) => {
        if (err) {
          throw err;
        }

        const projectid = results.rows[0].projectid;

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
      const tabActive = "overview";
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

  // Members
  router.get(
    "/:projectid/members",
    helper.isLoggedIn,
    function (req, res, next) {
      // INIT VARIABLES
      const projectid = parseInt(req.params.projectid);
      const tabActive = "members";
      let queryFilter = ``;
      let queryConfig = `SELECT membersconfig FROM users WHERE userid = $1`;
      let queryParamObj = req.query;
      let queryPage = "?page=";
      let subqueryTotalData = `SELECT members.userid, firstname, role 
        FROM members
        LEFT JOIN users ON users.userid = members.userid`;
      let query = `SELECT members.userid, firstname, role FROM members
        LEFT JOIN users ON users.userid = members.userid`;
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

  router.post(
    "/:projectid/members/option",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = req.params.projectid;
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
        res.redirect(`/projects/${projectid}/members`);
      });
    }
  );

  router.get(
    "/:projectid/members/add",
    helper.isLoggedIn,
    function (req, res, next) {
      const tabActive = "members";
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
          projectid,
          tabActive,
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
      const tabActive = "members";
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
          projectid,
          tabActive,
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

  // Issues
  router.get(
    "/:projectid/issues",
    helper.isLoggedIn,
    function (req, res, next) {
      // INIT VARIABLES
      const projectid = req.params.projectid;
      const tabActive = "issues";
      const config = {};
      const queryParamObj = req.query;
      const pagination = {
        totalPage: 1,
        currentPage: 1,
        perPage: 3,
        offset: 0,
        param: "",
      };
      let queryFilter = "";
      let queryPage = "?page=";
      let queryConfig = `SELECT issuesconfig FROM users WHERE userid = $1`;
      let subqueryTotalData = ` SELECT issueid, subject, tracker
        FROM issues`;
      let query = `SELECT issueid, subject, tracker
        FROM issues`;

      // PAGINATION
      pagination.currentPage = parseInt(req.query.page ? req.query.page : 1);
      pagination.offset = (pagination.currentPage - 1) * pagination.perPage;

      // FILTER
      [queryFilter, args, i] = helper.filterQueryParamIssues(
        req.query,
        queryFilter,
        projectid
      );

      if (queryFilter) {
        query += ` WHERE` + queryFilter;
        subqueryTotalData += ` WHERE` + queryFilter;
      }
      let queryTotalData = `SELECT COUNT(*) as totaldata FROM (${subqueryTotalData}) as issues`;

      // Add limit and offset to main query
      query += ` ORDER BY issueid`;
      query += ` LIMIT 3 OFFSET $${i + 1}`;

      db.query(queryConfig, [req.session.user.userid], (err, results) => {
        if (err) {
          throw err;
        }

        results.rows[0].issuesconfig.forEach((column) => {
          switch (column) {
            case "issueid":
              config.issueidcolumn = "issueid";
              break;
            case "subject":
              config.subjectcolumn = "subject";
              break;
            case "tracker":
              config.trackercolumn = "tracker";
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

            const data = results.rows;
            res.render("projects/issues/list", {
              title: "PMS Issues",
              projectid,
              tabActive,
              queryParamObj,
              config,
              data,
              pagination,
              queryPage,
            });
          });
        });
      });
    }
  );

  router.post(
    "/:projectid/issues/option",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = req.params.projectid;
      let args = [];
      let query = `UPDATE users SET issuesconfig = $1 WHERE userid = $2`;
      if (req.body.issueidcolumn) {
        args.push("issueid");
      }
      if (req.body.subjectcolumn) {
        args.push("subject");
      }
      if (req.body.trackercolumn) {
        args.push("tracker");
      }
      db.query(query, [args, req.session.user.userid], (err) => {
        if (err) {
          throw err;
        }
        res.redirect(`/projects/${projectid}/issues`);
      });
    }
  );

  router.get(
    "/:projectid/issues/add",
    helper.isLoggedIn,
    function (req, res, next) {
      const tabActive = "issues";
      const projectid = req.params.projectid;
      let queryUsers = `SELECT userid, firstname FROM users`;

      db.query(queryUsers, [], (err, results) => {
        if (err) {
          throw err;
        }

        const assigneeOptions = [];
        results.rows.forEach((item) => {
          assigneeOptions.push({
            userid: item.userid,
            firstname: item.firstname,
          });
        });

        res.render("projects/issues/add", {
          title: "Project Issue Add",
          assigneeOptions,
          projectid,
          tabActive,
        });
      });
    }
  );

  router.post(
    "/:projectid/issues/add",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = req.params.projectid;
      let filesReq = [];
      for (const file in req.files) {
        let fileItem = req.files[file];
        fileItem.mv(
          path.join(__dirname, "..", "/public/images/" + fileItem.name)
        );
        let fileObj = {
          name: fileItem.name,
          mimetype: fileItem.mimetype,
          path: "/images/" + fileItem.name,
        };
        filesReq.push(fileObj);
      }

      let query = `INSERT INTO issues (projectid, tracker, subject, description, status, priority, assignee, startdate, duedate, estimatedtime, done, files, spenttime, author, createddate, updateddate, parenttask)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`;
      let args = [
        parseInt(projectid),
        req.body.tracker,
        req.body.subject,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.body.assignee ? parseInt(req.body.assignee) : null,
        req.body.startdate ? new Date(req.body.startdate) : null,
        req.body.duedate ? new Date(req.body.duedate) : null,
        req.body.estimatedtime ? parseFloat(req.body.estimatedtime) : 0,
        parseInt(req.body.done),
        filesReq ? filesReq : null,
        0,
        req.session.user.userid,
        new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
          .toISOString()
          .replace("T", " ")
          .replace("Z", ""),
        new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
          .toISOString()
          .replace("T", " ")
          .replace("Z", ""),
        null,
      ];
      db.query(query, [...args], (err, results) => {
        if (err) {
          throw err;
        }

        let queryAddActivity = `
          INSERT INTO activity 
            (time, title, description, author, issueid, projectid)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING projectid
        `;

        let args = [];
        args.push(results.rows[0].createddate);
        args.push(results.rows[0].subject);
        args.push(results.rows[0].description);
        args.push(results.rows[0].author);
        args.push(results.rows[0].issueid);
        args.push(results.rows[0].projectid);

        db.query(queryAddActivity, [...args], (err, results) => {
          if (err) {
            throw err;
          }
          let projectid = results.rows[0].projectid;
          res.redirect(`/projects/${projectid}/issues`);
        });
      });
    }
  );

  router.get(
    "/:projectid/issues/edit/:issueid",
    helper.isLoggedIn,
    function (req, res, next) {
      const tabActive = "issues";
      const projectid = parseInt(req.params.projectid);
      const issueid = parseInt(req.params.issueid);

      let queryUsers = `SELECT userid, firstname FROM users`;
      let queryParentTask = `SELECT issueid, subject FROM issues
        WHERE issueid <> $1`;
      let queryIssue = `
        SELECT 
          issueid, projectid, tracker, subject, description, status, 
          priority, assignee, startdate, duedate, estimatedtime, done, 
          files, spenttime, targetversion, author, createddate, 
          updateddate, closeddate, parenttask
        FROM issues
        WHERE projectid = $1 AND issueid = $2
      `;

      db.query(queryUsers, [], (err, results) => {
        if (err) {
          throw err;
        }

        const assigneeOptions = [];
        results.rows.forEach((item) => {
          assigneeOptions.push({
            userid: item.userid,
            firstname: item.firstname,
          });
        });

        db.query(queryParentTask, [issueid], (err, results) => {
          if (err) {
            throw err;
          }

          const issueOptions = [];
          results.rows.forEach((item) => {
            issueOptions.push({
              issueid: item.issueid,
              subject: item.subject,
            });
          });

          db.query(queryIssue, [projectid, issueid], (err, results) => {
            if (err) {
              throw err;
            }

            if (results.rows.length == 0) {
              res.render("notfound", {
                title: "404 Not Found",
                projectid,
              });
            } else {
              res.render("projects/issues/edit", {
                title: "PMS Project Issue Edit",
                issue: results.rows[0],
                projectid,
                tabActive,
                assigneeOptions,
                issueOptions,
              });
            }
          });
        });
      });
    }
  );

  router.post(
    "/:projectid/issues/edit/:issueid",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const issueid = parseInt(req.params.issueid);
      const args = [];

      let query = `UPDATE issues SET`;

      if (req.body.tracker) {
        query += `, tracker = $${args.length + 1}`;
        args.push(req.body.tracker);
      }
      if (req.body.subject) {
        query += `, subject = $${args.length + 1}`;
        args.push(req.body.subject);
      }
      if (req.body.description) {
        query += `, description = $${args.length + 1}`;
        args.push(req.body.description);
      }
      if (req.body.status) {
        query += `, status = $${args.length + 1}`;
        args.push(req.body.status);
      }
      if (req.body.priority) {
        query += `, priority = $${args.length + 1}`;
        args.push(req.body.priority);
      }
      if (req.body.assignee) {
        query += `, assignee = $${args.length + 1}`;
        args.push(parseInt(req.body.assignee));
      }
      if (req.body.startdate) {
        query += `, startdate = $${args.length + 1}`;
        args.push(new Date(req.body.startdate));
      }
      if (req.body.duedate) {
        query += `, duedate = $${args.length + 1}`;
        args.push(new Date(req.body.duedate));
      }
      if (req.body.spenttime) {
        query += `, spenttime = $${args.length + 1}`;
        args.push(parseFloat(req.body.spenttime));
      }
      if (req.body.estimatedtime) {
        query += `, estimatedtime = $${args.length + 1}`;
        args.push(parseFloat(req.body.estimatedtime));
      }
      if (req.body.targetversion) {
        query += `, targetversion = $${args.length + 1}`;
        args.push(req.body.targetversion);
      }
      query += `, updateddate = $${args.length + 1}`;
      args.push(
        new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
          .toISOString()
          .replace("T", " ")
          .replace("Z", "")
      );
      if (req.body.closeddate) {
        query += `, closeddate = $${args.length + 1}`;
        args.push(new Date(req.body.closeddate));
      }
      if (req.body.parenttask) {
        query += `, parenttask = $${args.length + 1}`;
        args.push(parseInt(req.body.parenttask));
      }
      if (req.body.done) {
        query += `, done = $${args.length + 1}`;
        args.push(parseInt(req.body.done));
      }

      let filesReq = [];
      for (const file in req.files) {
        let fileItem = req.files[file];
        fileItem.mv(
          path.join(__dirname, "..", "/public/images/" + fileItem.name)
        );
        let fileObj = {
          name: fileItem.name,
          mimetype: fileItem.mimetype,
          path: "/images/" + fileItem.name,
        };
        filesReq.push(fileObj);
      }
      if (typeof req.body.oldfile == "string") {
        let [name, mimetype, path] = req.body.oldfile.split(",");
        let fileObj = {
          name,
          mimetype,
          path,
        };
        filesReq.push(fileObj);
      } else {
        for (let i = 0; i < req.body.oldfile?.length; i++) {
          const file = req.body.oldfile[i];
          let [name, mimetype, path] = file.split(",");
          let fileObj = {
            name,
            mimetype,
            path,
          };
          filesReq.push(fileObj);
        }
      }
      if (filesReq) {
        query += `, files = $${args.length + 1}`;
        args.push(filesReq);
      }

      query += ` WHERE projectid = $${args.length + 1}`;
      args.push(parseInt(projectid));
      query += ` AND issueid = $${args.length + 1}`;
      query += ` RETURNING *`;
      args.push(parseInt(issueid));

      query = query.replace(",", "");
      db.query(query, [...args], (err, results) => {
        if (err) {
          throw err;
        }

        if (req.body.oldimg) {
          filePath = path.join(__dirname, "..", "/public" + req.body.oldimg);
          fs.unlinkSync(filePath);
        }

        let queryAddActivity = `
          INSERT INTO activity 
            (time, title, description, author, issueid, projectid)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING projectid
        `;

        let args = [];
        args.push(results.rows[0].updateddate);
        args.push(results.rows[0].subject);
        args.push(results.rows[0].description);
        args.push(results.rows[0].author);
        args.push(results.rows[0].issueid);
        args.push(results.rows[0].projectid);

        db.query(queryAddActivity, [...args], (err, results) => {
          if (err) {
            throw err;
          }
          let projectid = results.rows[0].projectid;
          res.redirect(`/projects/${projectid}/issues`);
        });
      });
    }
  );

  router.get(
    "/:projectid/issues/delete/:issueid",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const issueid = parseInt(req.params.issueid);
      let query = `DELETE FROM issues WHERE issueid = $1 RETURNING *`;

      db.query(query, [issueid], (err, results) => {
        if (err) {
          throw err;
        }

        let queryAddActivity = `
          INSERT INTO activity 
            (time, title, description, author, issueid, projectid)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING projectid
        `;

        let args = [];
        args.push(
          new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
            .toISOString()
            .replace("T", " ")
            .replace("Z", "")
        );
        args.push(results.rows[0].subject);
        args.push(results.rows[0].description);
        args.push(results.rows[0].author);
        args.push(results.rows[0].issueid);
        args.push(results.rows[0].projectid);

        db.query(queryAddActivity, [...args], (err, results) => {
          if (err) {
            throw err;
          }

          const projectid = parseInt(results.rows[0].projectid);
          res.redirect(`/projects/${projectid}/issues`);
        });
      });
    }
  );

  // Activity
  router.get(
    "/:projectid/activity",
    helper.isLoggedIn,
    function (req, res, next) {
      const projectid = parseInt(req.params.projectid);
      const tabActive = "activity";
      let queryActivity = `SELECT activity.activityid, time, title, 
        activity.issueid, issues.status, activity.description, 
        activity.author, firstname
      FROM activity
      LEFT JOIN users ON users.userid = activity.author
      LEFT JOIN issues ON issues.issueid = activity.issueid
      WHERE activity.projectid = $1
        AND date_trunc('day', activity.time) = date_trunc('day', current_date)
        ORDER BY activity.time
        `;

      db.query(queryActivity, [projectid], (err, results) => {
        if (err) {
          throw err;
        }

        if (results.rows.length > 0) {
          const projectid = results.rows[0].projectid;
        }

        results.rows.forEach((activity, index) => {
          results.rows[index].formattedDate = moment(activity.time).format("L");
          results.rows[index].time.setHours(
            results.rows[index].time.getHours() + 7
          );
        });

        res.render("projects/activity/view", {
          title: "Project Activity",
          tabActive,
          projectid,
          data: results.rows,
          moment,
        });
      });
    }
  );

  return router;
};
