function pola(str) {
  let resArr = [];
  let elementsArr = str.split(" ");
  let operand = elementsArr[1];
  let op2 = parseInt(elementsArr[2]);
  if (operand == "*") {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let testOp1 = elementsArr[0].replace("#", i.toString());
        let testResult = elementsArr[4].replace("#", j.toString());
        let op1 = +testOp1;
        let result = +testResult;
        if (result == op1 * op2) {
          resArr.push(i);
          resArr.push(j);
          break;
        }
      }
    }
  }
  return resArr;
}

console.log(pola("42#3 * 188 = 80#204"));
console.log(pola("8#61 * 895 = 78410#5"));
