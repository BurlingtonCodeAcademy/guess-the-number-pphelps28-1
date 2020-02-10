const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
start();  //begins program
async function start() {
    topOfRange = parseInt(process.argv.slice(2)[0]) || 100 //process.argv returns an array of strings, converted to number
    let bottomOfRange = 1
    if (typeof topOfRange !== 'number') { //sanitizes range input; returns 100 if entry is not a number
        topOfRange = 100
    }
    console.log(`\n Make up a number and I'll try to guess it.  Make sure it's between 1 and ${topOfRange}`)

    ready(bottomOfRange, topOfRange);
    //starts recursion for first game
}
//////////////////////////////hoisted functions (for game1)////////////////////////////////////
function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, resolve);
    });
}
function aiGuess(min, max) { //calculates guess based on range, binary sorth algorithm
    let guess = Math.round(((max - min) / 2) + min)
    return guess
}
async function ready(min, max) { //code to initiate the game;  give user a chance to think of a number, or exit.
    let response = await ask('\n Ok, ready to play? "Y" or "N" ')
    response = response.trim().toUpperCase()
    if (response !== "Y" && response !== "N") {
        console.log('\n Invalid input! Type "Y" or "N" \n')
        return ready(min, max)
    } if (response == "N") {
        console.log("\n Awww ok.  Bye!\n")
        process.exit()
    } if (response == "Y") {
        isThisIt(min, max)
    }
}
async function isThisIt(min, max) { //takes range as arguments
    let guess = aiGuess(min, max)
    let yesOrNo = await ask(`\n Is your number ${guess}? respond "Y" or "N" \n`) //asks user if number is correct
    yesOrNo = yesOrNo.toUpperCase().trim() //  sanitizes answer
    while (yesOrNo !== "Y" && yesOrNo !== "N") { // error message if input is not correct, calls/sanitizes again
        console.log('\n Invalid input! \n')
        return isThisIt(min, max);
    } if (yesOrNo === "Y") { //win condition!  You said they guessed it, so the computer wins!
        console.log("\x1b[36m \n \n Your number was " + guess + "! ᕙ(^▿^-ᕙ)\n\x1b[0m \n Ok now it's my turn!")
        start2()
    } if (yesOrNo === "N" && min === max) {   //indicates an exhausted search based on given clues:  exits program. and judges you.
        console.log("\n You think this is a game? -_-+\n")
        process.exit();
    } if (yesOrNo === "N") { //calls next function to refactor range and guess again
        higherLower(min, max, guess)
    }
}
async function higherLower(min, max, currentGuess) {
    let higherOrLower = await ask('\n Ok, is your number higher or lower? "H" or "L" \n')
    higherOrLower = higherOrLower.toUpperCase().trim() //santitizes if possible
    while (higherOrLower !== "H" && higherOrLower !== "L") { // error message if input is not correct, calls / sanitizes again 
        console.log('\n Invalid input!\n')
        return higherLower(min, max, currentGuess)
    } if (higherOrLower === "H") {   //sets new min of range
        min = currentGuess + 1
    } else if (higherOrLower === "L") { //sets new max of range
        max = currentGuess - 1
    }
    isThisIt(min, max)  //calls stack with new range
}
////////////////////////////////////////////youGuess (game2)///////////////////////////////////////////////////
async function start2() {
    console.log(`\n Guess what number I'm thinking of.\n It's between 1 and ${topOfRange}`)
    let compNumber = Math.round(Math.random() * (topOfRange - 1) + 1) //fixed range;  kept formula syntax for easy substitution.
    console.log(compNumber) //displays computer's number.  For sanity's sake.
    promptGuess(compNumber)
}
//////////////////////////function(s)//////////////////////////
async function promptGuess(answer) {
    let playerGuess = await ask("\n Ok, what's your guess?\n")
    playerGuess = +playerGuess.trim() //sanitizes input
    while (isNaN(+playerGuess)) { //prompts input again if not a number
        console.log(`\n Invalid input!\n Please enter a number between 1 and ${topOfRange}.`)
        return promptGuess(answer)
    }
    if (playerGuess < 1 || playerGuess > topOfRange) { //prompts user again if not within range
        console.log(`\n I said it was between 1 and ${topOfRange}.  Cmon.`)
        return promptGuess(answer)
    }
    if (playerGuess === answer) {
        console.log("\x1b[36m \n DING DING DING DING!! My number was " + answer + " ᕙ(^▿^-ᕙ) \n\x1b[0m \n Ok, your turn! ")
        return start(); //calls first game again
    }
    if (playerGuess > answer) {
        console.log("\n Nope!  My number is LOWER than your guess")
        return promptGuess(answer)
    } else {
        console.log("\n Nope! My number is HIGHER than your guess")
        return promptGuess(answer)
    }
}
