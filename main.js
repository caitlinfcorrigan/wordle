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

    let submitGuess = document.querySelector("#guess")

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount = 0;

    // To return the outcome (win or loss)
    let outcome;

    let userGuess = [];

/*----- CACHED HTML ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgain = document.querySelector("#play-again");

    // Do I need to cache the gameboard?


/*----- EVENT LISTENERS -----*/
    // Listener for typed letters -- When user types, spell out the guess on screen
    document.addEventListener("keydown", checkKeyDown)

    // Listener for Enter button


    // Temp listeners for Input & Guess buttons
    submitGuess.addEventListener("click", colorGuess);

    // Listener for playAgain
    playAgain.addEventListener("click", init);


/*----- FUNCTIONS -----*/

    // Pick a secret word & hold in secretWord


    // Test the user's guess
    // userGuess = "lucky";
    secretWord = "cutie"

    // checkGuess(userGuess, secretWord)

    // Keydown function -- calls buildGuess, colorGuess, deleteGuess, or throwInvalid
    function checkKeyDown(e) {
        // Check for letter input
        // https://internetdrew.medium.com/how-to-detect-a-letter-key-on-key-events-with-javascript-c749820dcd27
        if (e.code === `Key${e.key.toUpperCase()}`){
            buildGuess(e);
        } else if (e.key === "Enter") {
            colorGuess();
        } else if (e.key === "Backspace") {
            deleteGuess();
        } else {
            return;
        }
    }


    // Delete guessed letters (before submit)
    function deleteGuess(){
        userGuess.pop()
    }



    // Need to figure out way to handle backspace
    function buildGuess(e){
        userGuess.push(e.key)
        userGuess.forEach((char,idx) => {
            // Display the char in the appropriate HTML element
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
            // Place the character in the inner text
            squareEl.innerHTML = char;
    });
    }

    // Callback function for click on Guess button
    function colorGuess(){
        let results = [];
        userGuess.forEach((char, idx) => {
            results.push(checkGuess(char,idx));
        })
        results.forEach((result,idx) => {
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
            squareEl.style.backgroundColor = CHECKS[result];
            squareEl.style.borderColor = CHECKS[result];
            squareEl.style.color = "white";
        })
    }

    function checkGuess(char, idx) {
            // Check the char against secretWord and return the result (key in the CHECKS constant)
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

    function init() {
        // Initialize empty board in JS
        board = []
        // TBD - Figure out how to grab a secret word
        secretWord = "apple";
        outcome = null;
        render()
    }

    function render() {
        playAgain.style.visibility = winner ? 'visible' : 'hidden';
    }

