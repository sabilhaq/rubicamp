function viewDate(date) {
  let newDate = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  let formatedDate = newDate.toLocaleDateString("id-ID", options);
  return formatedDate;
}

function page(filters, i, queryParams) {
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
  viewDate,
  page,
};
