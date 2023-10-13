/*----- CONSTANTS -----*/
    const CHECKS = {
        notIn: "rgb(110, 115, 115)",
        inDiffPos: "rgb(200, 180, 50)",
        inSamePos: "rgb(120, 170, 110)"
    }

    // For generating the secretWord
    const LETTERS = "abcdefghijklmnopqrstuvwxyz";

    // Using word list from https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
    import DICT from "./dictFull.json" assert { type: "json" };

    const defaultMessage = "Type a word then press Enter to guess";
    const winMessage = "You're smart cookie! You won!";
    const lossMessage = "Maybe next time.";
    const invalidWord = "Not a valid word.";
    const tooShort = "Your guess is too short.";

/*----- STATE VARIABLES -----*/
    let secretWord;
    let guessCount = 0;
    let userGuess = []; // Current guess
    let gameEnd = false;  // Variable to control display of Play Again button

    // Arrays to show correctness in the on-screen keyboard
    let notIn = [];
    let diffPos = [];
    let samePos = [];

/*----- CACHED HTML ELEMENTS -----*/
    
    const outcomeMessage = document.querySelector("h2");
    const playAgainBtn = document.querySelector("#play-again");
    playAgainBtn.style.visibility = 'hidden';    // Hide playAgain by default

    //On-screen keyboard
    const delBtn = document.querySelector("#del");
    const enterBtn = document.querySelector("#enter");
    const letterBtns = document.querySelectorAll(".letter");

/*----- EVENT LISTENERS -----*/
    // Listener for playAgain button
    playAgainBtn.addEventListener("click", reset);

    // Listener for keydown; calls function to determine appropriate response
    document.addEventListener("keydown", checkKeyDown);

    // Listeners for on-screen Del and Enter buttons
    delBtn.addEventListener("click", deleteLetter);
    enterBtn.addEventListener("click", submitGuess);

    // Add listeners to every on-screen letter button
    letterBtns.forEach((el) => {
        el.addEventListener("click", letterClick);
    })

/*----- FUNCTIONS -----*/

    function getSecretWord() {
        // Generate random number 0-26, then lookup in the LETTERS string
        let charIdx = Math.floor(Math.random() * (26 - 0) + 0);
        let char = LETTERS[charIdx];
        // Get the length of that char's array, then choose a random index in it
        let length = DICT[char].length;
        let wordIdx = Math.floor(Math.random() * length);
        // Pick word from dictonary using the random char and index
        secretWord = DICT[char][wordIdx];
    }

    // Fill the userGuess array as the user types/clicks and display in grid
    function buildGuess(letter){
        userGuess.push(letter);
        userGuess.forEach((char,idx) => {
            // Display the char in the appropriate HTML element
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`);
            // Place the character in the inner text
            squareEl.innerHTML = char.toUpperCase();
        });
    }

    function letterClick (e){
        // Get the letter from the event, then pass to buildGuss
        let clickedLetter = e.srcElement.id;
        if (clickedLetter !== "del" && clickedLetter !== "enter"){
            buildGuess(clickedLetter);
        }
    }

    // Handle all keydown events using buildGuess, submitGuess, deleteLetter
    function checkKeyDown(e) {
        // Check if input is a letter
        // https://internetdrew.medium.com/how-to-detect-a-letter-key-on-key-events-with-javascript-c749820dcd27
        if (e.code === `Key${e.key.toUpperCase()}`){
            let pressedLetter = e.key;
            buildGuess(pressedLetter);
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
        userGuess.pop();
        // Delete last letter from the DOM
        let squareEl = document.querySelector(`#g${guessCount}c${lastLetter-1}`)
        squareEl.innerHTML = "";
    }

    // Wait function for temporary message displays
    // https://www.sitepoint.com/delay-sleep-pause-wait/
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // When user submits their guess
    function submitGuess(){
        // Check guess is 5 letters
        if (userGuess.length < 5) {
            outcomeMessage.innerText = tooShort;
            sleep(1500).then(() => {
                outcomeMessage.innerText = defaultMessage;
            });
            return;
        }
        // Check whether guess is in dictionary; if not, delete guess from userGuess and grid
        if (spellCheck() !== true){
            outcomeMessage.innerText = invalidWord;
            sleep(1500).then(() => {
                deleteInnerText(guessCount);
                outcomeMessage.innerText = defaultMessage;
                clearArrays(userGuess);
            });
            return;
        } 
        // Create an array to hold results of checkGuess for each letter in userGuess
        let results = [];
        userGuess.forEach((char, idx) => {
            results.push(checkGuess(char,idx));
        })
        // Apply conditional formatting to HTML elements using indexed values in the results array
        results.forEach((result,idx) => {
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`);
            squareEl.style.backgroundColor = CHECKS[result];
            squareEl.style.borderColor = CHECKS[result];
            squareEl.style.color = "white";
        })
        // Apply conditional formatting to letters in the on-screen keyboard
        keyColor();

        // If every element in the results array is "inSamePos", return true; pass t/f as arg into checkForWin    
        let winResults = results.every((result) => result === "inSamePos");
        checkForWin(winResults);

        // If the game isn't over, increment guessCount and clear the userGuess array
        guessCount++;
        clearArrays(userGuess);
    }

    function spellCheck() {
        // Check for the userGuess in the DICT
        let isWord = userGuess.join("")
        let dictSearch = DICT[userGuess[0]].some((word) => {
            return word === isWord});
        return dictSearch;
    }

    function keyColor() {
        // Find the letter in keyboard arrays, then apply conditional formatting
        letterBtns.forEach((el) => {
            if (samePos.includes(el.id)) {
                console.log(el.id)
                el.style.backgroundColor = CHECKS.inSamePos;
                el.style.borderColor = CHECKS.inSamePos;
                el.style.color = "white";
                return;
            } else if (diffPos.includes(el.id)) {
                el.style.backgroundColor = CHECKS.inDiffPos;
                el.style.borderColor = CHECKS.inDiffPos;
                el.style.color = "white";
                return;
            } else if (notIn.includes(el.id)) {
                el.style.backgroundColor = CHECKS.notIn;
                el.style.borderColor = CHECKS.notIn;
                el.style.color = "white";
                return;
            }
        })
    }

    // Check a char from the guess against the secretWord and returns key for the CHECKS objects
    // Track the correctness of letters in keyboard arrays (samePos, diffPos, notIn)
    function checkGuess(char, idx) {
        if(char === secretWord[idx]) {
            checkArray(samePos, char);
            return "inSamePos";
        } else if (secretWord.includes(char)){
            checkArray(diffPos, char);
            return "inDiffPos";
        } else{
            checkArray(notIn, char)
            return "notIn";
        }
    }

    // Check whether the char already exists in the keyboard array
    function checkArray(arrayName, char) {
        if (arrayName.includes(char)) {
            return true;
        } else {
            arrayName.push(char)
            return false;
        }
    }

    // Ends game if passed a true value or guessCount is 5
    function checkForWin(winResults) {
         if (winResults) {
            // Remove the keydown event listener to stop accepting input
            document.removeEventListener("keydown", checkKeyDown);
            outcomeMessage.innerText = winMessage;
            gameEnd = true; // Displays play again button
            playAgain();
            return true;
         } else if (guessCount === 5) {
            document.removeEventListener("keydown", checkKeyDown);
            outcomeMessage.innerText = lossMessage;
            gameEnd = true;
            playAgain();
         } else {
            return;
        }
    }

    function playAgain() {
        playAgainBtn.style.visibility = gameEnd ? 'visible' : 'hidden';
        gameEnd = false;
    }

    // When Play Again button is clicked, reset the grid and keyboard
    function reset(e) {
        // Reset every row of DOM element using loops and the deleteInnerText function
        for (let g = 0; g < guessCount; g++) {
            deleteInnerText(g);
        }
        // Clear Win/Loss message and display default
        outcomeMessage.innerText = defaultMessage;

        // Reset keyboard to default display
        letterBtns.forEach((el) => {
            el.style.backgroundColor = "rgb(239,239,239)";
            el.style.borderColor = "rgb(110, 115, 115)";
            el.style.color = "black";
        })

        // Clear all arrays
        clearArrays(userGuess);
        clearArrays(notIn);
        clearArrays(diffPos);
        clearArrays(samePos);

        guessCount = 0;
        document.addEventListener("keydown", checkKeyDown); // Add back the keydown event listener
        playAgain(); // Hide the Play Again button
    }



    function deleteInnerText(row) {
        for (let i = 4; i > -1; i--){
            let squareEl = document.querySelector(`#g${row}c${i}`);
            squareEl.innerHTML = "";
            squareEl.style.backgroundColor = "white";
            squareEl.style.borderColor = "rgb(110, 110, 110)";
            squareEl.style.color = "black";
        }
    }

    function clearArrays(arrayToClear) {
        while (arrayToClear.length > 0) {
            arrayToClear.pop();
        }
    }
    
getSecretWord();