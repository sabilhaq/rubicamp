function sum() {
  let total = arguments[0] || 0;
  for (let index = 0; index < arguments.length; index++) {
    total += arguments[index];
  }
  console.log(total);
}

sum(1, 2, 7);
sum(1, 4);
sum(11);
sum(10, 3, 6, 7, 9);
sum();
