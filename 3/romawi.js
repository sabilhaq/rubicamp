function romawi(n) {
  let number = n
  let roman = "";
  let isThousands = (number / 1000) >= 1;
  let hundreds = number % 1000;
  let isHundreds = (hundreds / 100) >= 1;
  let tens = hundreds % 100;
  let isTens = (tens / 10) >= 1;
  let ones = tens % 10;

  if (isThousands) {
    roman += "M";
  }

  if (isHundreds) {
    if (hundreds < 400) {
      for (let i = hundreds; i > 100; i-=100) {
        roman += "C";
      }
    } else if (hundreds < 500) {
      roman += "CD";
    } else if (hundreds >= 900) {
      roman += "CM";
    } else { //between 500 and 899 (899 included)
      roman += "D";
      for (let i = 600; i < hundreds; i+=100) {
        roman += "C";
      }
    }
  }

  if(isTens) {
    if (tens < 40) {
      for (let i = tens; i > 10; i-=10) {
        roman += "X";
      }
    } else if (tens < 50) {
      roman += "XL";
    } else if (tens >= 90) {
      roman += "XC";
    } else { //between 50 and 89 (89 included)
      roman += "L";
      for (let i = 60; i < tens; i+=10) {
        roman += "X";
      }
    }
  }

  if (ones < 4) {
    for (let i = ones; i > 0; i-=1) {
      roman += "I";
    }
  } else if (ones < 5) {
    roman += "IV";
  } else if (ones >= 9) {
    roman += "IX";
  } else { //between 5 and 8 (8 included)
    roman += "V";
    for (let i = 6; i <= ones; i+=1) {
      roman += "I";
    }
  }

  return roman;
}

console.log("Script Testing untuk Konversi Romawi\n");
console.log("input | expected | result");
console.log("------|----------| ------");
console.log("4     | IV       | ", romawi(4));
console.log("9     | IX       | ", romawi(9));
console.log("13    | XIII     | ", romawi(13));
console.log("1453  | MCDLIII  | ", romawi(1453));
console.log("1646  | MDCXLVI  | ", romawi(1646));