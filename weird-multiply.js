function weirdMultiply(sentence) {
  if (sentence / 10 < 1) {
    return sentence;
  } else {
    let string = sentence.toString();
    const digits = string.split("");
    let nextNumber = digits.reduce((total, num) => {
      return total * num;
    });
    return weirdMultiply(nextNumber);
  }
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));
