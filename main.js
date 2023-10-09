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

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount = 0;

    // Holds the user's guess until submitted
    let userGuess = [];

    // Variable to control display of Play Again button
    let gameEnd = false;

/*----- CACHED HTML ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgain = document.querySelector("#play-again");
    // Hide playAgain by default
    playAgain.style.visibility = 'hidden';

/*----- EVENT LISTENERS -----*/
    // Listener for keydown; calls function to determine appropriate response
    document.addEventListener("keydown", checkKeyDown)


    // For on-screen submission -- update when there's a keyboard
    // submitGuess.addEventListener("click", colorGuess);

    // Listener for playAgain button
    playAgain.addEventListener("click", reset);


/*----- FUNCTIONS -----*/

    // Pick a secret word & hold in secretWord

    secretWord = "cutie";

    // Keydown function -- calls buildGuess, colorGuess, deleteGuess, or throwInvalid
    function checkKeyDown(e) {
        // Check if input is a letter
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
        // Get array length (to determine DOM elem to clear)
        let lastLetter = userGuess.length
        // Delete last letter from userGuess
        userGuess.pop()
        // Delete last letter from the DOM
        let squareEl = document.querySelector(`#g${guessCount}c${lastLetter-1}`)
        squareEl.innerHTML = "";
    }

    // Create an array with typed letters (not submitted)
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
    function colorGuess(){
        // Check guess is 5 letters
        if (userGuess.length < 5) {
            console.log("too short")
            return;
        }

        // Check whether guess is a word
        if (spellCheck() !== true){
            outcomeMessage.innerText = "Not a valid word";
            return;
        } else {
            console.log("valid word")
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
        // Check for win
        let winningLetters = (currChar) => currChar === "inSamePos";        
        winResults = results.every(winningLetters);
        checkForWin(winResults);

        guessCount++;

        // Reset userGuess
        clearLastGuess();
    }

    function spellCheck() {
        // Check for the userGuess in the DICT
        let isWord = userGuess.join("")
        let dictSearch = DICT[userGuess[0]].some((word) => {
                console.log(word)
                console.log(isWord)
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
    
    function checkForWin() {
         if (winResults) {
            // Remove the event listener -- stop accepting key input
            document.removeEventListener("keydown", checkKeyDown);
            // Display Winner message
            outcomeMessage.innerText = "You win!"
            // Render play again
            gameEnd = true;
            console.log(gameEnd)
            render();
            return true;
         } else if (guessCount === 5) {
            document.removeEventListener("keydown", checkKeyDown);
            outcomeMessage.innerText = "You lost :("
            gameEnd = true;
            render();
         } else {
            return;
        }
    }

    function reset(e) {
        // Reset every DOM element using loops to reset the HTML elem display
        for (let g = 0; g < guessCount; g++) {
            for (let i = 4; i > -1; i--){
                let squareEl = document.querySelector(`#g${g}c${i}`)
                squareEl.innerHTML = "";
                squareEl.style.backgroundColor = "white";
                squareEl.style.borderColor = "rgb(110, 110, 110)";
                squareEl.style.color = "black";
            }
        }

        // Add logic to remove Win/Loss message


        // Delete previous guess (the in-mem array)
        clearLastGuess();
        // Reset guessCount
        guessCount = 0;
        // Add back the keydown event listener

        console.log(document.addEventListener("keydown", checkKeyDown));
        render();
    }

    function render() {
        playAgain.style.visibility = gameEnd ? 'visible' : 'hidden';
        gameEnd = false;
    }

    function clearLastGuess() {
        for (let i = 0; i < 5; i++) {
            userGuess.pop();
        }
    }
    
