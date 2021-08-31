function stringManipulation(word) {
  switch (word.charAt(0)) {
    case "a":
    case "i":
    case "u":
    case "e":
    case "o":
      console.log(word);
      break;
    default:
      let letters = word.split("");
      let firstLetter = letters.shift();
      letters.push(firstLetter + "nyo");
      word = letters.join("");
      console.log(word);
      break;
  }
}

stringManipulation("ayam");
stringManipulation("bebek");
