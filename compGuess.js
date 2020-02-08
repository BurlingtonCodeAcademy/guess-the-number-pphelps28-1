const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  let bottomOfRange = 1
  let topOfRange = parseInt(process.argv.slice(2)[0]) || 100 //process.argv returns an array of strings, converted to number
  if (typeof topOfRange !== 'number') { //sanitizes range input; returns 100 if entry is not a number
    topOfRange = 100
  }
  console.log(`\nLet's play a game where you make up a number and I try to guess it.  Make sure it's between 1 and ${topOfRange}`)

  ready(bottomOfRange, topOfRange);
  //starts recursion
}

//////////////////////////////hoisted functions////////////////////////////////////

function aiGuess(min, max) { //calculates guess based on range, binary sorth algorithm
  let guess = Math.round(((max - min) / 2) + min)
  return guess
}

async function isThisIt(min, max) { //takes range as arguments
  let guess = aiGuess(min, max)
  let yesOrNo = await ask(`\nIs your number ${guess}? respond "Y" or "N" \n`) //asks user if number is correct
  yesOrNo = yesOrNo.toUpperCase().trim() //  sanitizes answer
  while (yesOrNo !== "Y" && yesOrNo !== "N") { // error message if input is not correct, calls/sanitizes again
    console.log('\n Invalid input! \n')
    return isThisIt(min, max);
  } if (yesOrNo === "Y") { //win condition!  You said they guessed it, so the computer wins!
    console.log("\nᕙ(^▿^-ᕙ) I did it!\n\n Your number was " + guess + "!\n")
    process.exit();
  } if (yesOrNo === "N" && min === max) {   //indicates an exhausted search based on given clues:  exits program. and judges you.
    console.log("\n You think this is a game? -_-+\n")
    process.exit();
  } if (yesOrNo === "N") { //calls next function to refactor range and guess again
    higherLower(min, max, guess)
  }
}

async function higherLower(min, max, currentGuess) {
  let higherOrLower = await ask('\nOk, is your number higher or lower? "H" or "L" \n')
  higherOrLower = higherOrLower.toUpperCase().trim() //santitizes if possible
  while (higherOrLower !== "H" && higherOrLower !== "L") { // error message if input is not correct, calls / sanitizes again 
    console.log('\nInvalid input!\n')
    return higherLower(min, max, currentGuess)
  } if (higherOrLower === "H") {   //sets new min of range
    min = currentGuess + 1
  } else if (higherOrLower === "L") { //sets new max of range
    max = currentGuess - 1
  }
  isThisIt(min, max)  //calls stack with new range
}

async function ready(min, max) {
  let response = await ask('\n Ok, ready to play? "Y" or "N" ')
  response = response.trim().toUpperCase()
  if (response !== "Y" && response !== "N") {
    console.log('\n Invalid input! Type "Y" or "N" \n')
    return ready()
  } if (response == "N") {
    console.log("\nAwww ok.  Bye!\n")
    process.exit()
  } if (response == "Y") {
    isThisIt(min, max)
  }
}