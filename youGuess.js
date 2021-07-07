const readline = require('readline')
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, resolve)
    })
}
start()
async function start() {
    console.log(`\n Ok. Hm.... I know!  Guess what number I'm thinking of.\n It's between 1 and 100`)
    let compNumber = Math.round(Math.random() * (100 - 1) + 1) //fixed range;  kept formula syntax for easy substitution.
    console.log(compNumber) //displays computer's number.  For sanity's sake.  I'm not gonna guess for it every time. 
    promptGuess(compNumber)
}
//////////////////////////functions//////////////////////////

async function promptGuess(answer) {
    let playerGuess = await ask("\n Ok, what's your guess?\n")
    playerGuess = parseFloat(playerGuess) //sanitizes input

    while (isNaN(playerGuess)) { //prompts input again if not a number
        console.log('\nInvalid input!\nPlease enter a number between 1 and 100.')
        return promptGuess(answer)
    }
    if (playerGuess < 1 || playerGuess > 100) { //prompts user again if not within range
        console.log('\nI said it was between 1 and 100.  Cmon.')
        return promptGuess(answer)
    }
    if (playerGuess === answer) {
        console.log(" \nDING DING DING DING!! My number was " + answer + " ᕙ(^▿^-ᕙ) ")
        process.exit()
    }
    if (playerGuess > answer) {
        console.log("\nNope!  My number is LOWER than your guess")
        return promptGuess(answer)
    } else {
        console.log("\nNope! My number is HIGHER than your guess")
        return promptGuess(answer)
    }
}
