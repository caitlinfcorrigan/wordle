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

    const defaultMessage = "Type a word then press Enter to guess";
    const winMessage = "You smart cookie! You won!";
    const lossMessage = "Maybe next time.";
    const invalidWord = "Not a valid word.";
    const tooShort = "Your guess is too short.";

/*----- STATE VARIABLES -----*/
    let secretWord;

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount = 0;

    // Holds the user's guess until submitted
    let userGuess = [];

    // Variable to control display of Play Again button
    let gameEnd = false;

    // Keyboard guess arrays
    let notIn = [];
    let diffPos = [];
    let samePos = [];

/*----- CACHED HTML ELEMENTS -----*/
    
    const outcomeMessage = document.querySelector("h2");
    const playAgainBtn = document.querySelector("#play-again");
    // Hide playAgain by default
    playAgainBtn.style.visibility = 'hidden';


    //On-screen buttons
    const delBtn = document.querySelector("#del");
    const enterBtn = document.querySelector("#enter")
    const letterBtns = document.querySelectorAll(".letter");

/*----- EVENT LISTENERS -----*/
    // Listener for keydown; calls function to determine appropriate response
    document.addEventListener("keydown", checkKeyDown)

    // Listeners for on-screen Del and Enter buttons
    delBtn.addEventListener("click", deleteLetter);
    enterBtn.addEventListener("click", submitGuess);

    // Add listeners to every letter button
    letterBtns.forEach((el) => {
        el.addEventListener("click", letterClick)
    })

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

    function letterClick (e){
        // buildGuess(e.srcElement.innerText)
        let clickedLetter = e.srcElement.id;

        if (clickedLetter !== "del" && clickedLetter !== "enter"){
            buildGuess(clickedLetter)
        }
    }


    // Keydown function -- calls buildGuess, submitGuess, deleteLetter, or throwInvalid
    function checkKeyDown(e) {
        // Check if input is a letter
        // https://internetdrew.medium.com/how-to-detect-a-letter-key-on-key-events-with-javascript-c749820dcd27
        if (e.code === `Key${e.key.toUpperCase()}`){
            let pressedLetter = e.key
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
        userGuess.pop()
        // Delete last letter from the DOM
        let squareEl = document.querySelector(`#g${guessCount}c${lastLetter-1}`)
        squareEl.innerHTML = "";
    }

    // Create an array with typed letters (hold in-memory until user submits guess)
    // Display letters as user types
    function buildGuess(letter){
        userGuess.push(letter)
        userGuess.forEach((char,idx) => {
            // Display the char in the appropriate HTML element
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
            // Place the character in the inner text
            // squareEl.innerHTML = char.toUpperCase();
            squareEl.innerHTML = char.toUpperCase();
        });
    }

    // Callback function for click on Guess button / press Enter
    function submitGuess(){
        // Check guess is 5 letters
        if (userGuess.length < 5) {
            outcomeMessage.innerText = tooShort;
            sleep(1500).then(() => {
                outcomeMessage.innerText = defaultMessage;
            });
            return;
        }
        // Check whether guess is a word
        if (spellCheck() !== true){
            outcomeMessage.innerText = invalidWord;
            // Delay 2 seconds, then clear guess and display defaultMessage
            sleep(1500).then(() => {
                deleteInnerText(guessCount);
                outcomeMessage.innerText = defaultMessage;
                clearArrays(userGuess);
            });
            return;
        } 
        // For each char, run checkGuess to compare to secretWord
        let results = [];
        userGuess.forEach((char, idx) => {
            results.push(checkGuess(char,idx));
        })
        // Apply conditional colors HTML elements using indexed values in results array
        results.forEach((result,idx) => {
            let squareEl = document.querySelector(`#g${guessCount}c${idx}`)
            squareEl.style.backgroundColor = CHECKS[result];
            squareEl.style.borderColor = CHECKS[result];
            squareEl.style.color = "white";
        })
        keyColor();

        // Check for win:
        // If every element in results array is "inSamePos", return true       
        let winResults = results.every((result) => result === "inSamePos");
        checkForWin(winResults);

        // If the game isn't over, increment guessCount and clear the userGuess array
        guessCount++;
        clearArrays(userGuess);
    }

    function keyColor() {
        // Compare every key button to notIn array
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


            // If user guesses letter and not in word -> gray
        // Create an array of incorrect guesses
        // Create an array of correct guesses
        // Create an array of diffPos guess -> splice when the pos is correct

    function spellCheck() {
        // Check for the userGuess in the DICT
        let isWord = userGuess.join("")
        let dictSearch = DICT[userGuess[0]].some((word) => {
            return word === isWord});
        return dictSearch;
        }

    // What if it returned an object of char: result
    function checkGuess(char, idx) {
        // Check the char against secretWord and return the result (key in the CHECKS constant)
        if(char === secretWord[idx]) {
            // Try adding to samePos array
            checkArray(samePos, char);
            // Check if in diffPos array and remove if it is
            if (diffPos.includes(char)) {
                // Get char's index in diffPos
                let index = diffPos.indexOf(char)
                // Splice char's index from diffPos
                diffPos.splice(index, 1)
            }
            return "inSamePos";
        } else if (secretWord.includes(char)){
            // Check if letter is green
            if (samePos.includes(char)) {
                return true;
            } else { // Otherwise, try adding to diffPos array
                checkArray(diffPos, char);
            }
            return "inDiffPos";
        } else{
            checkArray(notIn, char)
            return "notIn";
        }
    }

// If guess contains the same letter twice, but secretWord only contains it once, the second occurance isn't handled

    function checkArray(arrayName, char) {
        if (arrayName.includes(char)) {
            return true;
        } else {
            arrayName.push(char)
            return false;
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
        // clearArrays(userGuess);

        // Reset keyboard
        letterBtns.forEach((el) => {
            el.style.backgroundColor = "rgb(239,239,239)";
            el.style.borderColor = "rgb(110, 115, 115)";
            el.style.color = "black";
        })

        // Clear all arrays
        clearArrays(userGuess)
        clearArrays(notIn)
        clearArrays(diffPos)
        clearArrays(samePos)


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
    // Can this clear the keyboard arrays as well? Originally clearUserGuess with no param-- hardcoded to clear the one array
    function clearArrays(arrayToClear) {
        while (arrayToClear.length > 0) {
            arrayToClear.pop();
        }
    }
    
getSecretWord();