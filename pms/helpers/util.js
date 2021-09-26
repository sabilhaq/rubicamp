function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

function filterQueryParamMembers(param, query, projectid) {
  let i = 0;
  let filters = [];
  let args = [];

  filters.push({ name: "projectid", value: projectid });

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
          query += ` AND role = $${i + 1}`;
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
          query += ` AND projectid = $${i + 1}`;
          args.push(parseInt(param.projectid));
          break;
        case "name":
          query += ` AND name = $${i + 1}`;
          args.push(param.name);
          break;
        case "member":
          query += ` AND member LIKE $${i + 1}`;
          args.push("%" + param.member + "%");
          break;
        default:
          break;
      }
    }
    query = query.replace(" AND", "");
  }
  return [query, args, i];
}

module.exports = {
  isLoggedIn,
  filterQueryParamProjects,
  filterQueryParamMembers,
};
