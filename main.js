/*----- CONSTANTS -----*/
    const CHECKS = {
        notIn: "rgb(130, 130, 130)",
        inDiffPos: "rgb(250, 175, 45)",
        inSamePos: "rgb(50, 155, 80)",
    }

    // Mini dictionary for testing
    const DICT  = {
        a: ["apple", "atoms", "antsy"],
        b: ["batty", "backs", "butts"],
        c: ["catty", "chats", "comma"]
    }

/*----- STATE VARIABLES -----*/
    let secretWord;
    let board;

    // Initialize later as an array? 
    let userGuess; 
    let submitGuess = document.querySelector("#guess")

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount;

    // To return the outcome (win or loss)
    let outcome;

/*----- CACHED HTML ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgain = document.querySelector("#play-again");

    // Do I need to cache the gameboard?


/*----- EVENT LISTENERS -----*/
    // Listener for typed letters -- When user types, spell out the guess on screen
    // document.addEventListener("keydown", spellGuess)

    // Listener for Enter button


    // Temp listeners for Input & Guess buttons
    submitGuess.addEventListener("click", compareGuess);

    // Listener for playAgain
    playAgain.addEventListener("click", init);


/*----- FUNCTIONS -----*/

// Pick a secret word & hold in secretWord


// Test the user's guess
userGuess = "lucky";
secretWord = "cutie"
function renderGuess(userGuess, secretWord) {
    // For each letter in user guess, check secretWord
    Array.from(userGuess).forEach((char,idx) => {
        if(char === secretWord[idx]) {
            console.log("exact match");
            return "inSamePos";
        }
        else if (secretWord.includes(char)){   
            console.log("it's there somewhere");
            return "inDiffPos";
        }
        else{
            console.log("no dice");
            return "notIn";
        }
        // console.log(char);
        // console.log(secretWord[idx])
    })
        // 
}
renderGuess(userGuess, secretWord)


function init() {
    // Initialize empty board in JS
    board = [
        [], // Row 0
        [], // Row 1
        [], // Row 2
        [], // Row 3
        [], // Row 4
        [], // Row 5
    ]
    // TBD - Figure out how to grab a secret word
    secretWord = "apple";
    outcome = null;
    render()
}

function render() {
    spellGuess(e);
    playAgain.style.visibility = winner ? 'visible' : 'hidden';
}

function compareGuess() {

}


