/**
 * Pauze Timer Script
 * Handles timer functionality for the break activities
 */

document.addEventListener('DOMContentLoaded', function() {
    // Timer elements
    const timer = document.getElementById('timer');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerComplete = document.getElementById('timer-complete');
    const quoteElement = document.getElementById('quote');

    // Timer variables
    let timeLeft = 15 * 60; // 15 minutes in seconds
    let timerInterval;
    let isRunning = false;
    
    // Inspirational quotes to show when timer completes
    const quotes = [
        "Een korte pauze kan een grote impact hebben op je productiviteit.",
        "Neem de tijd om je hoofd leeg te maken, zodat je daarna meer kunt presteren.",
        "Een verfriste geest is een productieve geest.",
        "Goed gedaan! Je hebt een waardevolle investering gedaan in je mentale gezondheid.",
        "Regelmatige pauzes maken je studeren effectiever.",
        "Je brein heeft die pauze echt nodig om goed te kunnen functioneren.",
        "Ontspanning is een essentieel onderdeel van effectief studeren."
    ];
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Start or pause timer
    startPauseBtn.addEventListener('click', function() {
        if (isRunning) {
            // Pause timer
            clearInterval(timerInterval);
            startPauseBtn.textContent = 'Start';
            isRunning = false;
        } else {
            // Start timer
            timerInterval = setInterval(function() {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    // Timer complete
                    clearInterval(timerInterval);
                    timerComplete.style.display = 'block';
                    quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
                    startPauseBtn.textContent = 'Start';
                    isRunning = false;
                }
            }, 1000);
            
            startPauseBtn.textContent = 'Pauze';
            isRunning = true;
        }
    });
    
    // Reset timer
    resetBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        timeLeft = 15 * 60;
        updateTimerDisplay();
        timerComplete.style.display = 'none';
        startPauseBtn.textContent = 'Start';
        isRunning = false;
    });
    
    // Initial timer display
    updateTimerDisplay();
});