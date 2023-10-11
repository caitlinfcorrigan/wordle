/*----- CONSTANTS -----*/
    const CHECKS = {
        notIn: "rgb(110, 115, 115)",
        inDiffPos: "rgb(200, 180, 50)",
        inSamePos: "rgb(120, 170, 110)"
    }

    // For generating the secretWord
    const LETTERS = "abcdefghijklmnopqrstuvwxyz";

    // Mini dictionary for testing
    // const DICT  = {
    //     a: ["apple", "atoms", "antsy"],
    //     b: ["batty", "backs", "butts"],
    //     c: ["catty", "chats", "comma", "cutie"]
    // }

    // Using word list from https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
    import DICT from "./dictFull.json" assert { type: "json" };

    const defaultMessage = "Type a word then press Enter to guess"
    const winMessage = "You smart cookie! You won!"
    const lossMessage = "Maybe next time."

/*----- STATE VARIABLES -----*/
    let secretWord;

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount = 0;

    // Holds the user's guess until submitted
    let userGuess = [];

    // Variable to control display of Play Again button
    let gameEnd = false;

/*----- CACHED HTML ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgainBtn = document.querySelector("#play-again");
    // Hide playAgain by default
    playAgainBtn.style.visibility = 'hidden';
    const delBtn = document.querySelector("#del");
    const enterBtn = document.querySelector("#enter")

/*----- EVENT LISTENERS -----*/
    // Listener for keydown; calls function to determine appropriate response
    document.addEventListener("keydown", checkKeyDown)

    // For on-screen submission -- update when there's a keyboard
    delBtn.addEventListener("click", deleteLetter);
    enterBtn.addEventListener("click", submitGuess);

    // Listener for playAgain button
    playAgainBtn.addEventListener("click", reset);


/*----- FUNCTIONS -----*/

    function getSecretWord() {
        // Generate random number 0-26, then lookup in the LETTERS string
        let charIdx = Math.floor(Math.random() * (26 - 0) + 0);
        let char = LETTERS[charIdx]
        // Get the length of that char's array, then choose a random index in it
        let length = DICT[char].length
        let wordIdx = Math.floor(Math.random() * length);
        secretWord = DICT[char][wordIdx];
        console.log(secretWord);
    }

    // Wait function for temporary message displays
    // https://www.sitepoint.com/delay-sleep-pause-wait/
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Keydown function -- calls buildGuess, submitGuess, deleteLetter, or throwInvalid
    function checkKeyDown(e) {
        // Check if input is a letter
        // https://internetdrew.medium.com/how-to-detect-a-letter-key-on-key-events-with-javascript-c749820dcd27
        if (e.code === `Key${e.key.toUpperCase()}`){
            buildGuess(e);
        } else if (e.key === "Enter") {
            submitGuess();
        } else if (e.key === "Backspace") {
            deleteLetter();
        } else {
            return;
        }
    }

    // Delete guessed letters (before submit)
    function deleteLetter(){
        // Get array length (to determine DOM elem to clear)
        let lastLetter = userGuess.length
        // Delete last letter from userGuess
        userGuess.pop()
        // Delete last letter from the DOM
        let squareEl = document.querySelector(`#g${guessCount}c${lastLetter-1}`)
        squareEl.innerHTML = "";
    }

    // Create an array with typed letters (hold in-memory until user submits guess)
    // Display letters as user types
    function buildGuess(e){
        userGuess.push(e.key)
        userGuess.forEach((char,idx) => {
            // Display the char in the appropriate HTML element
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
            // Place the character in the inner text
            squareEl.innerHTML = char.toUpperCase();
        });
    }

    // Callback function for click on Guess button / press Enter
    function submitGuess(){
        // Check guess is 5 letters
        if (userGuess.length < 5) {
            outcomeMessage.innerText = "Too short!";
            sleep(1500).then(() => {
                outcomeMessage.innerText = defaultMessage;
            });
            return;
        }

        // Check whether guess is a word
        if (spellCheck() !== true){
            outcomeMessage.innerText = "Not a valid word";
            // Delay 2 seconds, then clear guess and display defaultMessage
            sleep(1500).then(() => {
                deleteInnerText(guessCount);
                outcomeMessage.innerText = defaultMessage;
                clearUserGuess();
            });
            return;
        } 

        // For each char, run checkGuess to compare to secretWord
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

        // Check for win:
        // Create the callback function for the every method
        let winningLetters = (currChar) => currChar === "inSamePos"; 
        // If every element in results array is "inSamePos", return true       
        let winResults = results.every(winningLetters);
        checkForWin(winResults);

        // If the game isn't over, increment guessCount and clear the userGuess array
        guessCount++;
        clearUserGuess();
    }

    function spellCheck() {
        // Check for the userGuess in the DICT
        let isWord = userGuess.join("")
        let dictSearch = DICT[userGuess[0]].some((word) => {
                return isWord === word;
            })
        return dictSearch;
        }

    function checkGuess(char, idx) {
        // Check the char against secretWord and return the result (key in the CHECKS constant)
        if(char === secretWord[idx]) {
            return "inSamePos";
        } else if (secretWord.includes(char)){   
            return "inDiffPos";
        } else{
            return "notIn";
        }
    }
    
    function checkForWin(winResults) {
         if (winResults) {
            // Remove the event listener -- stop accepting key input
            document.removeEventListener("keydown", checkKeyDown);
            // Display Winner message
            outcomeMessage.innerText = winMessage
            // Display play again button
            gameEnd = true;
            playAgain();
            return true;
         } else if (guessCount === 5) {
            document.removeEventListener("keydown", checkKeyDown);
            outcomeMessage.innerText = lossMessage
            gameEnd = true;
            playAgain();
         } else {
            return;
        }
    }

    function reset(e) {
        // Reset every row of DOM element using loops and the deleteInnerText function
        for (let g = 0; g < guessCount; g++) {
            deleteInnerText(g);
        }
        // Clear Win/Loss message and display default
        outcomeMessage.innerText = defaultMessage;
        // Delete the current guess from the userGuess array
        clearUserGuess();
        // Reset guessCount to 0
        guessCount = 0;
        // Add back the keydown event listener
        document.addEventListener("keydown", checkKeyDown);
        // Hide the Play Again button
        playAgain();
    }

    function playAgain() {
        playAgainBtn.style.visibility = gameEnd ? 'visible' : 'hidden';
        gameEnd = false;
    }

    function deleteInnerText(row) {
        for (let i = 4; i > -1; i--){
            let squareEl = document.querySelector(`#g${row}c${i}`)
            squareEl.innerHTML = "";
            squareEl.style.backgroundColor = "white";
            squareEl.style.borderColor = "rgb(110, 110, 110)";
            squareEl.style.color = "black";
        }
    }

    function clearUserGuess() {
        for (let i = 0; i < 5; i++) {
            userGuess.pop();
        }
    }
    
getSecretWord();