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
    // Listener for keydown; calls function to determine appropriate response
    document.addEventListener("keydown", checkKeyDown)


    // For on-screen submission -- update when there's a keyboard
    // submitGuess.addEventListener("click", colorGuess);

    // Listener for playAgain
    playAgain.addEventListener("click", reset);


/*----- FUNCTIONS -----*/

    // Pick a secret word & hold in secretWord


    // Test the user's guess
    // userGuess = "lucky";
    secretWord = "cutie".toUpperCase()


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

    function buildGuess(e){
        if (userGuess.length === 5) {
            return
        };
        userGuess.push(e.key.toUpperCase())
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
        // Check for win
        let winningLetters = (currChar) => currChar === "inSamePos";        
        winResults = results.every(winningLetters);
        checkForWin(winResults);

        guessCount++;
        console.log(guessCount)

        // Reset userGuess
        clearLastGuess();
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
    
    function checkForWin() {
         if (winResults) {
            // Remove the event listener -- stop accepting key input
            document.removeEventListener("keydown", checkKeyDown);
            // Display Winner message
            outcomeMessage.innerText = "You win!"
            // Render play again
            render();
            return true;
         } else if (guessCount === 5) {
            document.removeEventListener("keydown", checkKeyDown);
            outcomeMessage.innerText = "You lost :("
            render();
         } else {
            return;
        }
    }

    function reset(e) {

        // Reset every DOM element
        // Get array length (to determine DOM elem to clear)
        console.log("Reset")
        console.log(guessCount)
        // Remove letters and reset HTML elem display
        for (let g = 0; g < guessCount; g++) {
            console.log("guess loop")
            for (let i = 4; i > -1; i--){
                console.log("idx loop")
                let squareEl = document.querySelector(`#g${g}c${i}`)
                console.log(squareEl)
                squareEl.innerHTML = " ";
                squareEl.style.backgroundColor = "white";
                squareEl.style.borderColor = "rgb(110, 110, 110)";
            }
        }
        // Delete previous guess (only in-mem array)
        clearLastGuess();

        // Add back the keydown event listener
        document.addEventListener("keydown", checkKeyDown)
    }

    function render() {
        playAgain.style.visibility = checkForWin ? 'visible' : 'hidden';
    }

    function clearLastGuess() {
        for (let i = 0; i < 5; i++) {
            userGuess.pop();
        }
    }
    
