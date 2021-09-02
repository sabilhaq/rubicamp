function deretKaskus(n){
  const arr = [];
  if (n > 0) { 
    for (let i = 1, number = 3; i <= n; i++, number = number + 3) {
      if (number % 5 == 0 && number % 6 == 0) {
        arr.push("KASKUS");
      } else if (number % 5 == 0) {
        arr.push("KAS");
      } else if (number % 6 == 0) {
        arr.push("KUS");
      } else {
        arr.push(number);
      }
    }
  }
  return arr;
}

console.log(deretKaskus(10));