const { argv } = require("process");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Jawaban: ",
});

if (argv[2] === undefined) {
  console.log("Tolong sertakan nama file sebagai inputan soalnya");
  console.log("Misalnya 'node solution.js data.json");
  rl.close();
} else {
  const fs = require("fs");
  let data = fs.readFileSync(argv[2], "utf-8");
  let questions = JSON.parse(data);
  let i = 0;
  let countWrong = 0;

  console.log(
    `Selamat datang di permainan Tebak-tebakan. kamu akan diberikan pertanyaan dari file ini '${argv[2]}'.`
  );
  console.log("Untuk bermain, jawablah dengan jawaban yang sesuai.");
  console.log(
    "Gunakan 'skip' untuk menangguhkan pertanyaannya, dan di akhir pertanyaan akan ditanyakan lagi."
  );

  console.log(`\nPertanyaan: ${questions[i].definition}`);
  rl.prompt();
  rl.on("line", (line) => {
    let capitalFirst = questions[i].term[0].toUpperCase();
    let capitalAnswer = questions[i].term.replace(
      questions[i].term[0],
      capitalFirst
    );

    let capitalFirstSkip = "skip".toUpperCase();
    let capitalSkip = questions[i].term.replace("skip", capitalFirstSkip);

    if (
      line.trim() == questions[i].term ||
      line.trim() == questions[i].term.toUpperCase() ||
      line.trim() == questions[i].term.toLowerCase ||
      line.trim() == capitalAnswer
    ) {
      console.log("\nAnda Beruntung!\n");
      i++;
      countWrong = 0;
      if (i < questions.length) {
        console.log(`Pertanyaan: ${questions[i].definition}`);
        rl.prompt();
      } else {
        console.log("Anda Berhasil!\n");
        rl.close();
      }
    } else if (
      line.trim() == "skip" ||
      line.trim() == "skip".toUpperCase() ||
      line.trim() == capitalSkip
    ) {
      questions.push(questions[i]);
      i++;
      countWrong = 0;
      if (i < questions.length) {
        console.log(`\nPertanyaan: ${questions[i].definition}`);
        rl.prompt();
      }
    } else {
      countWrong++;
      console.log(
        `\nAnda Kurang Beruntung! anda telah salah ${countWrong} kali, silahkan coba lagi.`
      );
      rl.prompt();
    }
  });
}
