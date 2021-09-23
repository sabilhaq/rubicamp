function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

function filterQueryParam(param, query) {
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
      const filter = filters[i];
      switch (filters[i].name) {
        case "projectid":
          query += ` AND projectid = $${i + 1}`;
          args.push(param.projectid);
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
  filterQueryParam,
};
