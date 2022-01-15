function spiral(size) {
  const matriks = [];
  let count = 0;
  for (let i = 0; i < size; i++) {
    matriks[i] = [];
    for (let j = 0; j < size; j++) {
      matriks[i][j] = count++;
    }
  }

  let x = 0,
    y = 0;
  let batasAtas = size;
  let batasBawah = 0;

  let result = [];

  while (result.length < size * size) {
    // ke kanan
    for (; x < batasAtas; x++) {
      result.push(matriks[y][x]);
    }
    x--;
    y++;
    // ke bawah
    for (; y < batasAtas; y++) {
      result.push(matriks[y][x]);
    }
    y--;
    x--;
    // ke kiri
    for (; x >= batasBawah; x--) {
      result.push(matriks[y][x]);
    }
    x++;
    y--;
    // ke atas
    for (; y > batasBawah; y--) {
      result.push(matriks[y][x]);
    }
    x++;
    y++;
    batasBawah++;
    batasAtas--;
  }
  console.log(result);
}

spiral(5);
spiral(6);
spiral(7);
