function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

function filterQueryParamUsers(param, query) {
  let i = 0;
  let filters = [];
  let args = [];
  if (param.useridcheck && param.userid) {
    filters.push({ name: "userid", value: parseInt(param.userid) });
  }
  if (param.firstnamecheck && param.firstname) {
    filters.push({ name: "firstname", value: param.firstname });
  }
  if (param.lastnamecheck && param.lastname) {
    filters.push({ name: "lastname", value: param.lastname });
  }
  if (param.rolecheck && param.role) {
    filters.push({ name: "role", value: param.role });
  }
  if (param.positioncheck && param.position) {
    filters.push({ name: "position", value: param.position });
  }

  if (filters.length > 0) {
    for (; i < filters.length; i++) {
      switch (filters[i].name) {
        case "userid":
          query += ` AND users.userid = $${i + 1}`;
          args.push(parseInt(param.userid));
          break;
        case "firstname":
          query += ` AND firstname LIKE $${i + 1}`;
          args.push("%" + param.firstname + "%");
          break;
        case "lastname":
          query += ` AND lastname LIKE $${i + 1}`;
          args.push("%" + param.lastname + "%");
          break;
        case "role":
          query += ` AND role = $${i + 1}`;
          args.push(param.role);
          break;
        case "position":
          query += ` AND position = $${i + 1}`;
          args.push(param.position);
          break;
        default:
          break;
      }
    }
    query = query.replace(" AND", "");
  }
  return [query, args, i];
}

function filterQueryParamProjects(param, query) {
  let i = 0;
  let filters = [];
  let args = [];
  if (param.projectidcheck && param.projectid) {
    filters.push({ name: "projectid", value: parseInt(param.projectid) });
  }
  if (param.namecheck && param.name) {
    filters.push({ name: "name", value: param.name });
  }
  if (param.membercheck && param.member) {
    filters.push({ name: "member", value: param.member });
  }

  if (filters.length > 0) {
    for (; i < filters.length; i++) {
      switch (filters[i].name) {
        case "projectid":
          query += ` AND projects.projectid = $${i + 1}`;
          args.push(parseInt(param.projectid));
          break;
        case "name":
          query += ` AND name = $${i + 1}`;
          args.push(param.name);
          break;
        case "member":
          query += ` AND STRING_AGG ('#' || users.userid::text || '#', ',') LIKE $${
            i + 1
          }`;
          args.push("%#" + param.member + "#%");
          break;
        default:
          break;
      }
    }
    query = query.replace(" AND", "");
  }
  return [filters, query, args, i];
}

function filterQueryParamMembers(param, query, projectid) {
  let i = 0;
  let filters = [];
  let args = [];

  filters.push({ name: "projectid", value: parseInt(projectid) });

  if (param.useridcheck && param.userid) {
    filters.push({ name: "userid", value: parseInt(param.userid) });
  }
  if (param.firstnamecheck && param.firstname) {
    filters.push({ name: "firstname", value: param.firstname });
  }
  if (param.positioncheck && param.position) {
    filters.push({ name: "position", value: param.position });
  }

  if (filters.length > 0) {
    for (; i < filters.length; i++) {
      switch (filters[i].name) {
        case "userid":
          query += ` AND members.userid = $${i + 1}`;
          args.push(parseInt(param.userid));
          break;
        case "firstname":
          query += ` AND firstname LIKE $${i + 1}`;
          args.push("%" + param.firstname + "%");
          break;
        case "position":
          query += ` AND members.role = $${i + 1}`;
          args.push(param.position);
          break;
        default:
          query += ` AND projectid = $${i + 1}`;
          args.push(projectid);
          break;
      }
    }
  }
  query = query.replace(" AND", "");
  return [query, args, i];
}

function filterQueryParamIssues(param, query, projectid) {
  let i = 0;
  let filters = [];
  let args = [];

  filters.push({ name: "projectid", value: parseInt(projectid) });

  if (param.issueidcheck && param.issueid) {
    filters.push({ name: "issueid", value: parseInt(param.issueid) });
  }
  if (param.subjectcheck && param.subject) {
    filters.push({ name: "subject", value: param.subject });
  }
  if (param.trackercheck && param.tracker) {
    filters.push({ name: "tracker", value: param.tracker });
  }

  if (filters.length > 0) {
    for (; i < filters.length; i++) {
      switch (filters[i].name) {
        case "issueid":
          query += ` AND issues.issueid = $${i + 1}`;
          args.push(parseInt(param.issueid));
          break;
        case "subject":
          query += ` AND issues.subject LIKE $${i + 1}`;
          args.push("%" + param.subject + "%");
          break;
        case "tracker":
          query += ` AND issues.tracker = $${i + 1}`;
          args.push(param.tracker);
          break;
        default:
          query += ` AND issues.projectid = $${i + 1}`;
          args.push(projectid);
          break;
      }
    }
  }
  query = query.replace(" AND", "");
  return [query, args, i];
}

function formatPage(filters, i, queryParams) {
  let filter = `${param?.filter ? param?.filter : ""}`;
  let page = `${param?.pageNext ? "&page=" + param.pageNext : ""}`;
  let sortBy = `${param?.sortBy ? "&sort=" + param?.sortBy : ""}`;
  let sortOrder = `${param?.sortOrder ? "&order=" + param?.sortOrder : ""}`;

  let allQueryParams = filter + page + sortBy + sortOrder;
  allQueryParams = allQueryParams.replace(/\?/g, "&");
  allQueryParams = allQueryParams.replace("&", "?");

  let url = `http://localhost:3000/types${allQueryParams}`;

  if (filters.length == 0) {
    return `?page=${i}`;
  } else {
    arrQueryParams = queryParams.split("&");
    let formatedQueryParams = "";
    if (arrQueryParams[arrQueryParams.length - 1].search("page") != -1) {
      arrQueryParams.pop();
    }
    formatedQueryParams = arrQueryParams.join("&");
    return formatedQueryParams.concat(`&page=${i}`);
  }
}

module.exports = {
  isLoggedIn,
  filterQueryParamUsers,
  filterQueryParamProjects,
  filterQueryParamMembers,
  filterQueryParamIssues,
  formatPage,
};
