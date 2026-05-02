const hangmanImage = document.querySelector(".hangman-box img")
const wordDisplay = document.querySelector(".word-display")
const guessesText = document.querySelector(".guesses-text b")
const keyboardDiv = document.querySelector(".keyboard")
const gameModal = document.querySelector(".game-modal")

let currentWord, correctLetters = [], wrongGuessCount = 0
const maxGuesses = 6

const getRandomWord = () => {
    correctLetters = []
    wrongGuessCount = 0
    
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)]
    currentWord = word
    console.log("New word:", word)
    
    document.querySelector(".hint-text b").innerText = hint
    wordDisplay.innerHTML = word.split("").map(() => `<li class="letter"></li>`).join("")
    
    hangmanImage.src = `hangman-0.svg`
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`
    
    document.querySelectorAll(".keyboard button").forEach(btn => {
        btn.disabled = false
    })
    
    if (gameModal) gameModal.classList.remove("show")
}

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? "You found the word:" : "The correct word was:"
        
        const modalImg = gameModal ? gameModal.querySelector("img") : null
        const modalH4 = gameModal ? gameModal.querySelector("h4") : null
        const modalP = gameModal ? gameModal.querySelector("p") : null
        
        if (modalImg) modalImg.src = `${isVictory ? 'victory' : 'lost'}.gif`
        if (modalH4) modalH4.innerText = isVictory ? 'Congrats!' : 'Game Over!'
        if (modalP) modalP.innerHTML = `${modalText} <b>${currentWord}</b>`
        
        if (gameModal) gameModal.classList.add("show")
    }, 300)
}

const initGame = (button, clickedLetter) => {
    if (button.disabled) return
    if (wrongGuessCount >= maxGuesses) return
    
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter)
                }
                wordDisplay.querySelectorAll("li")[index].innerText = letter
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed")
            }
        })
    } else {
        wrongGuessCount++
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`
    }
    
    button.disabled = true
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`
    
    const uniqueLetters = [...new Set(currentWord.split(""))]
    
    if (wrongGuessCount === maxGuesses) return gameOver(false)
    if (correctLetters.length === uniqueLetters.length) return gameOver(true)
}

// Create keyboard buttons
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button")
    button.innerText = String.fromCharCode(i)
    keyboardDiv.appendChild(button)
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)))
}

// Start game
getRandomWord()

// Fix Play Again button
let playAgainBtn = document.querySelector(".play-again")

if (!playAgainBtn && gameModal) {
    playAgainBtn = document.createElement("button")
    playAgainBtn.className = "play-again"
    playAgainBtn.innerText = "Play Again"
    playAgainBtn.style.margin = "20px auto 0"
    playAgainBtn.style.padding = "12px 24px"
    playAgainBtn.style.fontSize = "18px"
    playAgainBtn.style.fontWeight = "bold"
    playAgainBtn.style.cursor = "pointer"
    playAgainBtn.style.backgroundColor = "#4CAF50"
    playAgainBtn.style.color = "white"
    playAgainBtn.style.border = "none"
    playAgainBtn.style.borderRadius = "8px"
    playAgainBtn.style.display = "block"
    gameModal.appendChild(playAgainBtn)
    console.log("Play Again button created automatically")
}

if (playAgainBtn) {
    playAgainBtn.onclick = function() {
        console.log("Play Again clicked - reloading page")
        location.reload()
    }
}