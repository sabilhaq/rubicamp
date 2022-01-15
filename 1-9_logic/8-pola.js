function pola(statement) {
  const split1 = statement.split('*');
  let angka1 = split1[0].trim();
  const split2 = split1[1].split('=');
  let angka2 = split2[0].trim();
  let angka3 = split2[1].trim();

  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      if (angka1.replace('#', i) * angka2 == angka3.replace('#', j)) {
        return [i, j];
      }
    }
  }
}

console.log(pola('42#3 * 188 = 80#204'));
console.log(pola('8#61 * 895 = 78410#5'));
