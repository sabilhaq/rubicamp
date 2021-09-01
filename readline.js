const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "tulis kalimatmu disini > ",
});

rl.prompt();

rl.on("line", (line) => {
  let words = line.trim().split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    switch (word.charAt(0)) {
      case "a":
      case "i":
      case "u":
      case "e":
      case "o":
        words[i] = word;
        break;
      default:
        let letters = word.split("");
        let firstLetter = letters.shift();
        letters.push(firstLetter + "nyo");
        word = letters.join("");
        words[i] = word;
        break;
    }
  }
  console.log("hasil konversi: " + words.join(" "));
  rl.prompt();
}).on("close", () => {
  console.log("Good bye!");
  process.exit(0);
});
