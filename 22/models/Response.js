class Response {
  constructor(data, err) {
    this.data = data || null;
    this.errorMessage = '' || err;
  }
}

module.exports = Response;