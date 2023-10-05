# Wordle
Wordle is a single-player game. The player tries to guess the secret 5-letter word. If the guess is correct, all five letters display in green. If a guess is incorrect, any letters that are in the secret word and in the correct position display in green. Any letters in the secret word, but in the wrong position, display in yellow. The game displays the player's previous guesses.

If the player is unable to guess the secret word within six guesses, they lose.

At the end of the game (win or lose), the player can choose to play again with a new secret word.
---
## Technologies Used
HTML, CSS, and JavaScript

---
## Wireframes


---
## MVP Goals
* Generate a list of valid, 5-letter word from an English dictionary or other source
* Add the list of words to an array as uppercase strings
* Pick a secret word
* Render the board as a grid of 6 rows of 5 squares (array of arrays)
* Accept player guesses via keyboard; only accept letters (A-Z)
* As the player types, the letter displays in uppercase in the current row (first guess is the top row)
* When the player clicks the Guess button or presses enter, validate that the guess is 5 letters, convert the string to uppercase, and check that it is a word (find it in the list)
    * If it's not a word, clear the guess and display message "Not a valid word"
    * If it's a valid guess, compare the player's guess against the secret word
* Save the guess in the row and highlight letters as follows:
    * Dark gray: The letter is not in the secret word
    * Yellow: The letter is in the secret word, but a different position
    * Green: The letter is in the secret word and the correct position
* The player wins if they guess the secret word by the 6th guess (all letters are green)
* The player loses if they do not guess the secret word by the 6th guess
* At the end, display button to allow the player to play again with a new word

---
## Stretch Goals
* The game displays an on-screen keyboard which also highlights guessed letters (dark gray if not in the secret word, green if in the word and in the correct position, and yellow if in the secret word, but a different position)
* The on-screen keyboard is clickable
* The game counts the number of wins and 
* Display game rules before the player can begin playing

### Big Stretches
* Display examples of green/yellow guesses in the game rules
* Display 4 grids and 4 secret words; every guess evaluates against all 4 words. The player wins if they guess all 4 secret words within 9 guesses.

---
## Potential Roadblocks
* Loading the word list into memory
* Rendering an on-screen QWERTY keyboard with Return/Enter and Backspace keys