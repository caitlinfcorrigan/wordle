/*----- CONSTANTS -----*/
    const CHECKS = {
        notIn: "rgb(110, 110, 110)",
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
    let guessCount = 0;

    // To return the outcome (win or loss)
    let outcome;

/*----- CACHED HTML ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgain = document.querySelector("#play-again");

    // Do I need to cache the gameboard?


/*----- EVENT LISTENERS -----*/
    // Listener for typed letters -- When user types, spell out the guess on screen
    document.addEventListener("keydown", buildGuess)

    // Listener for Enter button


    // Temp listeners for Input & Guess buttons
    submitGuess.addEventListener("click", displayGuess);

    // Listener for playAgain
    playAgain.addEventListener("click", init);


/*----- FUNCTIONS -----*/

// Pick a secret word & hold in secretWord


// Test the user's guess
// userGuess = "lucky";
secretWord = "cutie"



function checkGuess(char, idx) {
    // Check the char against secretWord
        if(char === secretWord[idx]) {
            return "inSamePos";
        }
        else if (secretWord.includes(char)){   
            return "inDiffPos";
        }
        else{
            return "notIn";
        }
}
// checkGuess(userGuess, secretWord)

let unsubmittedGuess = [];
function buildGuess(e){
    unsubmittedGuess.push(e.key)
    console.log(unsubmittedGuess)
}

// Must use the event as a param because of the eventListener
function displayGuess(e){
    console.log(typeof(unsubmittedGuess))
    console.log(unsubmittedGuess)
    userGuess = unsubmittedGuess.join("")
    console.log(userGuess)
    // When the user clicks submit, grab their guess the input elem's value
    // userGuess = document.querySelector("input").value
    Array.from(userGuess).forEach((char,idx) => {
        console.log(char)
        // Display the char in the appropriate HTML element
        let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
        // Place the character in the inner text
        squareEl.innerHTML = char;
    })
};

function colorGuess(){
    let result = checkGuess(char, idx, secretWord)
    console.log(CHECKS[result])
    squareEl.style.backgroundColor = CHECKS[result];
    squareEl.style.borderColor = CHECKS[result];
    squareEl.style.color = "white";
}

// displayGuess(userGuess)

// Display
// Wait for submit
// After submit, checkGuess -> colorGuess


function init() {
    // Initialize empty board in JS
    board = []
    // TBD - Figure out how to grab a secret word
    secretWord = "apple";
    outcome = null;
    render()
}

function render() {
    spellGuess(e);
    playAgain.style.visibility = winner ? 'visible' : 'hidden';
}


