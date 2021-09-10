function viewDate(date) {
  let newDate = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  let formatedDate = newDate.toLocaleDateString("id-ID", options);
  return formatedDate;
}

module.exports = {
  viewDate,
};
