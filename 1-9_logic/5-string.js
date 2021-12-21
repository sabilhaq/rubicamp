function stringManipulation(word) {
  if (
    word[0].toLowerCase() == 'a' ||
    word[0].toLowerCase() == 'i' ||
    word[0].toLowerCase() == 'u' ||
    word[0].toLowerCase() == 'e' ||
    word[0].toLowerCase() == 'o'
  ) {
    console.log(word);
  } else {
    console.log(`${word.slice(1)}${word[0]}nyo`);
  }
}

stringManipulation('ayam');
stringManipulation('bebek');
