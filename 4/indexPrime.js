function indexPrime(param1) {
  if (param1 == 1) {
    return 2;
  }
  let number = 3;
  let elemenPrimeKe = 1;
  let latestPrime = 2;
  while (elemenPrimeKe < param1) {
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % Math.sqrt(number) == 0) {
        break;
      }
      // console.log(number);
      // console.log(i);
      if (number / i == i) {
        break;
      }
      if (number % 2 == 0) {
        break;
      }
      if (number == i * i) {
        break;
      }
      if (number % i == 0) {
        if (i >= Math.sqrt(number)) {
          elemenPrimeKe++;
          latestPrime = number;
          if (elemenPrimeKe == param1) {
            return number;
          } else {
            number++;
            i = 1;
          }
        }
        // if (number == i) {
        //   elemenPrimeKe++;
        //   latestPrime = number;
        //   if (elemenPrimeKe == param1) {
        //     return number;
        //   } else {
        //     number++;
        //     i = 1;
        //   }
        // } else {
        //   // continue;
        //   break;
        // }
      }
    }
    number++;
  }
  return number;
}
// console.log(indexPrime(2));
// console.log(indexPrime(3));
console.log(indexPrime(4));
// console.log(indexPrime(5));
// console.log(indexPrime(6));
// console.log(indexPrime(7));
// console.log(indexPrime(8));
// console.log(indexPrime(9));
// console.log(indexPrime(10));
// console.log(indexPrime(11));
console.log(indexPrime(500));
console.log(indexPrime(37786));
