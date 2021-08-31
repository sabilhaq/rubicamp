function sentencesManipulation(sentence) {
  let arr = sentence.split(" ");
  for (let i = 0; i < arr.length; i++) {
    let word = arr[i];
    switch (word.charAt(0)) {
      case "a":
      case "i":
      case "u":
      case "e":
      case "o":
        arr[i] = word;
        break;
      default:
        let letters = word.split("");
        let firstLetter = letters.shift();
        letters.push(firstLetter + "nyo");
        word = letters.join("");
        arr[i] = word;
        break;
    }
  }
  console.log(arr.join(" "));
}

sentencesManipulation("ibu pergi ke pasar bersama aku");
