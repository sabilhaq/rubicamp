function indexPrime(param1) {
  const arr = [];
  if (param1 == 1) {
    return 2;
  }
  for (let i = 2; arr.length < param1; i++) {
    let countPrime = 0;
    for (let j = 2; j <= i; j++) {
      if (i % j == 0) {
        countPrime++;
      }
    }
    if (countPrime == 1) {
      arr.push(i);
      continue;
    }
  }
  return arr[param1 - 1];
}

console.log(indexPrime(4));
console.log(indexPrime(500));
console.log(indexPrime(37786));
