function indexPrime(param1) {
  if (param1 == 1) {
    return 2;
  }
  let number = 3;
  let elemenPrimeKe = 1;
  while (elemenPrimeKe < param1) {
    let iCheck = 2;
    let isPrime = false;
    while (!isPrime) {
      if (number % 2 == 0) {
        number++;
      }
      if (number % iCheck == 0) {
        number++;
      } else {
        iCheck++;
        if (iCheck == number) {
          isPrime = true;
          elemenPrimeKe++;
        }
      }
    }
    number++;
  }
  return number - 1;
}
console.log(indexPrime(2));
console.log(indexPrime(6));
console.log(indexPrime(7));
console.log(indexPrime(8));
console.log(indexPrime(9));
console.log(indexPrime(10));
console.log(indexPrime(11));
console.log(indexPrime(500));
console.log(indexPrime(37786));
