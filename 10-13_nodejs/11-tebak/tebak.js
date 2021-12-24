const fs = require('fs');
const readline = require('readline');

const soal = JSON.parse(fs.readFileSync('soal.json', 'utf-8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Tebakan: ',
});

let count = 0;

console.log('Selamat datang di permainan Tebak Kata, silakan isi dengan jawaban yang benar ya!\n');

console.log(`Pertanyaan: ${soal[count].definition}`);

rl.prompt();

rl.on('line', (answer) => {
  if (answer.toLowerCase() == soal[count].term.toLowerCase()) {
    console.log('Selamat Anda Benar!\n');
    count++;
    if (count < soal.length) {
      console.log(`Pertanyaan: ${soal[count].definition}`);
      // rl.prompt();
    } else {
      console.log('Hore Anda Menang!\n');
      rl.close();
    }
  } else {
    console.log('Wkwkwkwk, Anda kurang beruntung!\n');
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
