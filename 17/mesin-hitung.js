class MesinHitung {
  constructor() {
    this.x = 1;
  }
  // Method
  add(op) {
    this.x += op;
    return this;
  }
  subtract(op) {
    this.x -= op;
    return this;
  }
  multiply(op) {
    this.x = Math.round(this.x * op);
    return this;
  }
  divide(op) {
    this.x = Math.round(this.x / op);
    return this;
  }
  exponent(op) {
    this.x = Math.pow(this.x, op);
    return this;
  }
  square() {
    this.x = Math.pow(this.x, 2);
    return this;
  }
  squareRoot() {
    this.x = Math.round(Math.sqrt(this.x));
    return this;
  }
  result() {
    console.log(this.x);
  }
}

export { MesinHitung };
