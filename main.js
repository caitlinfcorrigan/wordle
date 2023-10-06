/*----- CONSTANTS -----*/
    const CHECKS = {
        notIn: "rgb(130, 130, 130)",
        inDiffPos: "rgb(250, 175, 45)",
        inSamePos: "rgb(50, 155, 80)",
    }

/*----- STATE VARIABLES -----*/
    let board;
    // Initialize later as an array that 
    let guess; 

    // Count the number of guesses? Or just do a check of the board's array?
    let guessCount;

    // To return the outcome (win or loss)
    let outcome;

/*----- CACHED ELEMENTS -----*/
    const outcomeMessage = document.querySelector("h2");
    const playAgain = document.querySelector("button");

    // Do I need to cache the gameboard?


/*----- EVENT LISTENERS -----*/
    // Listener for typed letters 
    document.addEventListener("keydown")

    // Listener for Enter


    // Listener for playAgain
    playAgain.addEventListener("click", init);


/*----- FUNCTIONS -----*/