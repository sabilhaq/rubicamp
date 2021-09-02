function spiral(param1) {
  let arr = [];
  let num = 0;
  for (let i = 0; i < param1; i++) {
    arr[i] = [];
    for (let j = 0; j < param1; j++) {
      arr[i][j] = num;
      num++;
    }
  }

  let resArr = [];
  for (let i = 0, param = param1; i < param; i++, param--) {
    // right direction
    for (let j = i; j < param - 1; j++) {
      if (arr[i][j] == 9) {
      }
      resArr.push(arr[i][j]);
    }
    // downward direction
    for (let j = i; j < param - 1; j++) {
      if (arr[j][param - 1] == 9) {
      }
      resArr.push(arr[j][param - 1]);
    }
    // left direction
    for (let j = param - 1; j > i; j--) {
      if (arr[param - 1][j] == 9) {
      }
      resArr.push(arr[param - 1][j]);
    }
    // upward direction
    for (let j = param - 1; j > i; j--) {
      if (arr[j][i] == 9) {
      }
      resArr.push(arr[j][i]);
    }
  }
  // push matrix middle element for odd params
  if (param1 % 2 !== 0) {
    resArr.push(arr[(param1 - 1) / 2][(param1 - 1) / 2]);
  }
  console.log(resArr);
}

spiral(5);
spiral(6);
spiral(7);
