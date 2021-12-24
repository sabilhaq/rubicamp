const fs = require('fs');
const readline = require('readline');

if (!process.argv[2]) {
  console.log('Tolong sertakan nama file sebagai inputan soalnya');
  console.log('Misalnya: $ node tebakskip.js soal.json');
  process.exit(1);
}

try {
  const soal = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Tebakan: ',
  });

  let count = 0;
  let wrong = 0;

  console.log(
    'Selamat datang di permainan Tebak Kata, silakan isi dengan jawaban yang benar ya!\n'
  );

  console.log(`Pertanyaan: ${soal[count].definition}`);

  rl.prompt();

  rl.on('line', (answer) => {
    if (answer.toLowerCase() != soal[count].term.toLowerCase() && answer.toLowerCase() == 'skip') {
      soal.push(soal[count]);
      count++;
      console.log(`Pertanyaan: ${soal[count].definition}`);
    } else {
      if (answer.toLowerCase() == soal[count].term.toLowerCase()) {
        console.log('Selamat Anda Benar!\n');
        wrong = 0;
        count++;
        if (count < soal.length) {
          console.log(`Pertanyaan: ${soal[count].definition}`);
          rl.prompt();
        } else {
          console.log('Hore Anda Menang!\n');
          rl.close();
        }
      } else {
        wrong++;
        console.log(`Anda Kurang Beruntung! Anda telah salah ${wrong} kali, silakan coba lagi.\n`);
      }
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
} catch (err) {
  console.log('sertakan nama file dengan benar!');
}
