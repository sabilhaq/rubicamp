const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Tebakan: ",
});

const fs = require("fs");
let data = fs.readFileSync("data.json", "utf-8");
let questions = JSON.parse(data);
let i = 0;

console.log(
  "Selamat datang di permainan Tebak Kata, silahkan isi dengan jawaban yang benar ya!\n"
);
console.log(`Pertanyaan: ${questions[i].definition}`);
rl.prompt();
rl.on("line", (line) => {
  let capitalFirst = questions[i].term[0].toUpperCase();
  let capitalAnswer = questions[i].term.replace(
    questions[i].term[0],
    capitalFirst
  );
  if (
    line.trim() == questions[i].term ||
    line.trim() == questions[i].term.toUpperCase() ||
    line.trim() == questions[i].term.toLowerCase ||
    line.trim() == capitalAnswer
  ) {
    console.log("Selamat Anda Benar!\n");
    i++;
    if (i < questions.length) {
      console.log(`Pertanyaan: ${questions[i].definition}`);
      rl.prompt();
    } else {
      console.log("Hore Anda Menang!\n");
      rl.close();
    }
  } else {
    console.log("Wkwkwkwk, Anda kurang beruntung!\n");
    rl.prompt();
  }
});
