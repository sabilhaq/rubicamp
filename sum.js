function sum(){
  let sum = 0;
  for (const index in arguments) {
    sum += arguments[index]
  }
  console.log(sum);
  return sum;
}

sum(1, 2, 7);
sum(1, 4);
sum(11);
sum(10, 3, 6, 7, 9);