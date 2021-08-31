function sentencesManipulation(sentence) {
  let words = sentence.split(" ");
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
  console.log(words.join(" "));
}

sentencesManipulation("ibu pergi ke pasar bersama aku");
