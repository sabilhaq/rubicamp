function weirdMultiply(number) {
  let numberString = number.toString();
  if (numberString.length == 1) {
    return number;
  } else {
    let total = numberString[0];
    for (let i = 1; i < numberString.length; i++) {
      total *= numberString[i];
    }
    return weirdMultiply(total);
  }
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));
