function sum(...args){
  let sum = 0;
  args.forEach(arg => sum += arg);
  console.log(sum);
  return sum;
}

sum(1, 2, 7);
sum(1, 4);
sum(11);
sum(10, 3, 6, 7, 9);