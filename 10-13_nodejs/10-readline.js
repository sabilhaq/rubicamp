const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'tulis kalimatmu di sini > ',
});

rl.prompt();

rl.on('line', (line) => {
  console.log(`hasil konversi: ${sentencesManipulation(line)}`);
  rl.prompt();
}).on('close', () => {
  console.log('Good bye!');
});

function stringManipulation(word) {
  if (
    word[0].toLowerCase() == 'a' ||
    word[0].toLowerCase() == 'i' ||
    word[0].toLowerCase() == 'u' ||
    word[0].toLowerCase() == 'e' ||
    word[0].toLowerCase() == 'o'
  ) {
    return word;
  } else {
    return `${word.slice(1)}${word[0]}nyo`;
  }
}

function sentencesManipulation(sentence) {
  let words = sentence.split(' ');
  words.forEach((word, index) => {
    words[index] = stringManipulation(word);
  });
  return words.join(' ');
}
