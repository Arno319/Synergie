/**
 * 2048 Game Implementation for StudentBuddy
 */
window.load2048GameImpl = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="game-2048">
      <div class="game-header">
        <div class="score-container">
          <div>Score: <span id="score-2048">0</span></div>
          <div>Best: <span id="best-score-2048">0</span></div>
        </div>
        <div class="controls-container">
          <button id="new-game-2048" class="btn">New Game</button>
        </div>
      </div>
      
      <div class="game-intro">
        <p>Join the tiles, get to <strong>2048!</strong> Use arrow keys or swipe to move.</p>
      </div>
      
      <div class="grid-container">
        <div class="grid-background">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        
        <div class="grid-tiles" id="grid-tiles">
          <!-- Tiles will be added here dynamically -->
        </div>
      </div>
      
      <div class="game-message" id="game-message-2048">
        <p></p>
        <div class="message-buttons">
          <button id="retry-button" class="btn">Try again</button>
          <button id="keep-playing-button" class="btn">Keep going</button>
        </div>
      </div>
    </div>
    <style>
      .game-2048 {
        max-width: 450px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .score-container {
        font-weight: bold;
        font-size: 18px;
      }
      
      .game-intro {
        text-align: center;
        margin-bottom: 20px;
        color: #666;
      }
      
      .grid-container {
        position: relative;
        width: 100%;
        max-width: 450px;
        aspect-ratio: 1 / 1;
        margin-bottom: 30px;
        border-radius: 6px;
        background-color: #bbada0;
        overflow: hidden;
      }
      
      .grid-background {
        position: absolute;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
      }
      
      .grid-cell {
        background-color: rgba(238, 228, 218, 0.35);
        border-radius: 3px;
      }
      
      .grid-tiles {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      
      .tile {
        position: absolute;
        box-sizing: border-box;
        background-color: #eee4da;
        border-radius: 3px;
        font-weight: bold;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      
      .tile.tile-2 {
        background-color: #eee4da;
        color: #776e65;
      }
      
      .tile.tile-4 {
        background-color: #ede0c8;
        color: #776e65;
      }
      
      .tile.tile-8 {
        background-color: #f2b179;
        color: #f9f6f2;
      }
      
      .tile.tile-16 {
        background-color: #f59563;
        color: #f9f6f2;
      }
      
      .tile.tile-32 {
        background-color: #f67c5f;
        color: #f9f6f2;
      }
      
      .tile.tile-64 {
        background-color: #f65e3b;
        color: #f9f6f2;
      }
      
      .tile.tile-128 {
        background-color: #edcf72;
        color: #f9f6f2;
      }
      
      .tile.tile-256 {
        background-color: #edcc61;
        color: #f9f6f2;
      }
      
      .tile.tile-512 {
        background-color: #edc850;
        color: #f9f6f2;
      }
      
      .tile.tile-1024 {
        background-color: #edc53f;
        color: #f9f6f2;
      }
      
      .tile.tile-2048 {
        background-color: #edc22e;
        color: #f9f6f2;
      }
      
      .tile.tile-super {
        background-color: #3c3a32;
        color: #f9f6f2;
      }
      
      .tile.tile-new {
        animation: appear 0.2s;
      }
      
      .tile.tile-merged {
        animation: pop 0.2s;
      }
      
      @keyframes appear {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pop {
        0% {
          transform: scale(0.8);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      
      .game-message {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(238, 228, 218, 0.73);
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        animation: fade-in 0.5s;
        opacity: 0;
        pointer-events: none;
      }
      
      .game-message.game-won, .game-message.game-over {
        opacity: 1;
        pointer-events: auto;
      }
      
      .game-message p {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .message-buttons {
        display: flex;
        gap: 10px;
      }
      
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @media (max-width: 480px) {
        .game-2048 {
          padding: 10px;
        }
        
        .grid-container {
          max-width: 300px;
        }
        
        .grid-background {
          gap: 6px;
          padding: 6px;
        }
        
        .grid-tiles {
          padding: 6px;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // DOM Elements
  const scoreDisplay = document.getElementById('score-2048');
  const bestScoreDisplay = document.getElementById('best-score-2048');
  const gridTiles = document.getElementById('grid-tiles');
  const gameMessage = document.getElementById('game-message-2048');
  const newGameButton = document.getElementById('new-game-2048');
  const retryButton = document.getElementById('retry-button');
  const keepPlayingButton = document.getElementById('keep-playing-button');
  
  // Game state
  let grid = [];
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('2048-best-score')) || 0;
  let won = false;
  let over = false;
  let keepPlaying = false;
  let touchStartX = 0;
  let touchStartY = 0;
  
  // Initialize the game
  initGame();
  updateBestScore();
  
  // Game functions
  function initGame() {
    grid = createEmptyGrid();
    score = 0;
    won = false;
    over = false;
    keepPlaying = false;
    
    // Add 2 initial tiles
    addRandomTile();
    addRandomTile();
    
    // Update UI
    updateScore();
    renderGrid();
    
    // Remove game message
    gameMessage.className = 'game-message';
    gameMessage.querySelector('p').textContent = '';
  }
  
  function createEmptyGrid() {
    const newGrid = [];
    for (let i = 0; i < 4; i++) {
      newGrid[i] = [];
      for (let j = 0; j < 4; j++) {
        newGrid[i][j] = 0;
      }
    }
    return newGrid;
  }
  
  function getAvailableCells() {
    const cells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          cells.push({ x: i, y: j });
        }
      }
    }
    return cells;
  }
  
  function addRandomTile() {
    const cells = getAvailableCells();
    if (cells.length === 0) return;
    
    const { x, y } = cells[Math.floor(Math.random() * cells.length)];
    grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
  
  function renderGrid() {
    // Clear current tiles
    gridTiles.innerHTML = '';
    
    // Get grid container dimensions
    const gridContainer = document.querySelector('.grid-container');
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    
    // Calculate tile size based on grid size
    const tileSize = (containerWidth - 50) / 4; // 50px for padding and gaps
    const gap = 10; // Gap between tiles
    const padding = 10; // Grid padding
    
    // Add new tiles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] !== 0) {
          const tile = document.createElement('div');
          
          // Set tile value and position
          const value = grid[i][j];
          const tileClass = value <= 2048 ? `tile-${value}` : 'tile-super';
          
          tile.className = `tile ${tileClass}`;
          tile.textContent = value;
          
          // Calculate position
          const xPos = padding + j * (tileSize + gap);
          const yPos = padding + i * (tileSize + gap);
          
          // Apply calculated dimensions and position
          tile.style.width = `${tileSize}px`;
          tile.style.height = `${tileSize}px`;
          tile.style.left = `${xPos}px`;
          tile.style.top = `${yPos}px`;
          
          // Adjust font size based on number length
          if (value < 100) {
            tile.style.fontSize = `${tileSize / 2}px`;
          } else if (value < 1000) {
            tile.style.fontSize = `${tileSize / 2.5}px`;
          } else {
            tile.style.fontSize = `${tileSize / 3}px`;
          }
          
          gridTiles.appendChild(tile);
        }
      }
    }
  }
  
  function updateScore() {
    scoreDisplay.textContent = score;
  }
  
  function updateBestScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('2048-best-score', bestScore);
    }
    bestScoreDisplay.textContent = bestScore;
  }
  
  function moveTiles(direction) {
    if (over || (won && !keepPlaying)) return;
    
    let moved = false;
    
    // Helper functions for tile movement
    function moveLeft() {
      let moved = false;
      
      for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(val => val !== 0);
        let newRow = [];
        
        // Merge tiles
        for (let j = 0; j < row.length; j++) {
          if (j < row.length - 1 && row[j] === row[j + 1]) {
            newRow.push(row[j] * 2);
            score += row[j] * 2;
            row[j + 1] = 0;
            j++;
            
            // Check for win
            if (newRow[newRow.length - 1] === 2048 && !won) {
              won = true;
            }
          } else {
            newRow.push(row[j]);
          }
        }
        
        // Pad with zeros
        while (newRow.length < 4) {
          newRow.push(0);
        }
        
        // Check if row has changed
        if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
          moved = true;
        }
        
        grid[i] = newRow;
      }
      
      return moved;
    }
    
    function moveRight() {
      let moved = false;
      
      for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(val => val !== 0);
        let newRow = Array(4).fill(0);
        
        // Process tiles from right to left
        let index = 3;
        
        for (let j = row.length - 1; j >= 0; j--) {
          if (j > 0 && row[j] === row[j - 1]) {
            newRow[index] = row[j] * 2;
            score += row[j] * 2;
            j--;
            
            // Check for win
            if (newRow[index] === 2048 && !won) {
              won = true;
            }
          } else {
            newRow[index] = row[j];
          }
          index--;
        }
        
        // Check if row has changed
        if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
          moved = true;
        }
        
        grid[i] = newRow;
      }
      
      return moved;
    }
    
    function moveUp() {
      let moved = false;
      
      // Transpose the grid
      grid = transposeGrid(grid);
      
      // Move left
      moved = moveLeft();
      
      // Transpose back
      grid = transposeGrid(grid);
      
      return moved;
    }
    
    function moveDown() {
      let moved = false;
      
      // Transpose the grid
      grid = transposeGrid(grid);
      
      // Move right
      moved = moveRight();
      
      // Transpose back
      grid = transposeGrid(grid);
      
      return moved;
    }
    
    function transposeGrid(grid) {
      const newGrid = createEmptyGrid();
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          newGrid[j][i] = grid[i][j];
        }
      }
      return newGrid;
    }
    
    // Move tiles based on direction
    switch (direction) {
      case 'left':
        moved = moveLeft();
        break;
      case 'right':
        moved = moveRight();
        break;
      case 'up':
        moved = moveUp();
        break;
      case 'down':
        moved = moveDown();
        break;
    }
    
    // If tiles moved, add a new tile and check game state
    if (moved) {
      addRandomTile();
      updateScore();
      updateBestScore();
      renderGrid();
      
      // Check game state
      checkGameState();
    }
  }
  
  function checkGameState() {
    // Check if won
    if (won && !keepPlaying) {
      gameMessage.className = 'game-message game-won';
      gameMessage.querySelector('p').textContent = 'You win!';
    }
    
    // Check if game over
    if (!hasAvailableMoves()) {
      over = true;
      gameMessage.className = 'game-message game-over';
      gameMessage.querySelector('p').textContent = 'Game over!';
    }
  }
  
  function hasAvailableMoves() {
    // Check if there are empty cells
    if (getAvailableCells().length > 0) {
      return true;
    }
    
    // Check if adjacent tiles can be merged
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = grid[i][j];
        
        // Check right
        if (j < 3 && current === grid[i][j + 1]) {
          return true;
        }
        
        // Check down
        if (i < 3 && current === grid[i + 1][j]) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Event listeners
  document.addEventListener('keydown', handleKeyPress);
  
  function handleKeyPress(e) {
    if (over || (won && !keepPlaying)) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveTiles('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveTiles('right');
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveTiles('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveTiles('down');
        break;
    }
  }
  
  // Touch controls for mobile
  gridTiles.addEventListener('touchstart', handleTouchStart, { passive: true });
  gridTiles.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // Determine the direction of the swipe
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 50) {
        moveTiles('right');
      } else if (dx < -50) {
        moveTiles('left');
      }
    } else {
      // Vertical swipe
      if (dy > 50) {
        moveTiles('down');
      } else if (dy < -50) {
        moveTiles('up');
      }
    }
    
    // Reset touch coordinates
    touchStartX = null;
    touchStartY = null;
  }
  
  // Window resize handler
  window.addEventListener('resize', renderGrid);
  
  // Button event listeners
  newGameButton.addEventListener('click', initGame);
  retryButton.addEventListener('click', initGame);
  
  keepPlayingButton.addEventListener('click', () => {
    keepPlaying = true;
    gameMessage.className = 'game-message';
  });
};

// For backward compatibility
function load2048Game() {
  window.load2048GameImpl();
}
