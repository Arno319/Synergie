/**
 * Memory Game Implementation for StudentBuddy
 */
function loadMemoryGame(config = { language: 'nl', translations: {} }) {
  // Use the passed translations
  const t = config.translations;

  const symbols = [
    "🍎", "🍌", "🍒", "🍊", "🍇", "🍓", "🍑", "🍐", "🍉", "🥝", "🍋", "🥭"
  ];
  const gameSymbols = [...symbols, ...symbols]; // Duplicate for pairs

  // Shuffle the symbols
  for (let i = gameSymbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameSymbols[i], gameSymbols[j]] = [gameSymbols[j], gameSymbols[i]];
  }

  const gameHTML = `
    <div class="memory-game">
      <div class="memory-stats">
        <div>${t.moves}: <span id="moves-count">0</span></div>
        <div>${t.matches}: <span id="matches-count">0</span>/12</div>
      </div>
      <div class="memory-board">
        ${gameSymbols.map((symbol, index) => `
          <div class="memory-card" data-index="${index}">
            <div class="memory-card-inner">
              <div class="memory-card-front">?</div>
              <div class="memory-card-back">${symbol}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <style>
      .memory-game {
        padding: 20px;
      }
      .memory-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .memory-board {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
        perspective: 1000px;
      }
      .memory-card {
        height: 80px;
        cursor: pointer;
      }
      .memory-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }
      .memory-card.flipped .memory-card-inner {
        transform: rotateY(180deg);
      }
      .memory-card.matched .memory-card-inner {
        transform: rotateY(180deg);
        box-shadow: 0 0 5px 2px #4caf50;
      }
      .memory-card-front, .memory-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        border-radius: 4px;
      }
      .memory-card-front {
        background-color: #004c97;
        color: white;
      }
      .memory-card-back {
        background-color: #f1f1f1;
        transform: rotateY(180deg);
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // Game logic
  const cards = document.querySelectorAll(".memory-card");
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let moves = 0;
  let matches = 0;

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Prevent double-click on same card

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      // First card flipped
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Second card flipped
    secondCard = this;
    moves++;
    document.getElementById("moves-count").textContent = moves;

    checkForMatch();
  }

  function checkForMatch() {
    const isMatch =
      firstCard.querySelector(".memory-card-back").textContent ===
      secondCard.querySelector(".memory-card-back").textContent;

    if (isMatch) {
      disableCards();
      matches++;
      document.getElementById("matches-count").textContent = matches;

      if (matches === symbols.length) {
        setTimeout(() => {
          alert(t.congratulations);
        }, 500);
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  cards.forEach((card) => card.addEventListener("click", flipCard));
}
