document.addEventListener('DOMContentLoaded', function() {
    // Timer variables
    let timer;
    let timeLeft = 15 * 60; // 15 minutes in seconds
    let isRunning = false;
    
    // Get DOM elements
    const modal = document.getElementById('timerModal');
    const activityTitle = document.getElementById('activity-title');
    const timerDisplay = document.getElementById('timer');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerComplete = document.getElementById('timer-complete');
    const quoteElement = document.getElementById('quote');
    const closeBtn = document.querySelector('.close-btn');
    
    // Inspirational quotes
    const quotes = [
        "De enige manier om goed werk te doen is om te houden van wat je doet. - Steve Jobs",
        "Succes is niet de sleutel tot geluk. Geluk is de sleutel tot succes. - Albert Schweitzer",
        "Het geheim van vooruitgang is om te beginnen. - Mark Twain",
        "Elke prestatie begint met de beslissing om het te proberen. - Gail Devers",
        "Je tijd is beperkt, dus verspil het niet door het leven van een ander te leiden. - Steve Jobs",
        "Het is nooit te laat om te worden wat je had kunnen zijn. - George Eliot",
        "Het leven is wat er gebeurt terwijl je druk bent met andere plannen maken. - John Lennon",
        "De toekomst hangt af van wat je vandaag doet. - Mahatma Gandhi",
        "Geloof dat je het kunt, en je bent al halverwege. - Theodore Roosevelt",
        "De weg naar succes is altijd in aanbouw. - Lily Tomlin"
    ];
    
    // Start exercise buttons
    const startExerciseButtons = document.querySelectorAll('.start-exercise');
    startExerciseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activity = this.getAttribute('data-activity');
            openTimerModal(activity);
        });
    });
    
    // Function to open timer modal
    function openTimerModal(activity) {
        activityTitle.textContent = activity;
        resetTimer();
        modal.style.display = 'block';
    }
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        pauseTimer();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            pauseTimer();
        }
    });
    
    // Start/Pause button
    startPauseBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', resetTimer);
    
    // Start timer function
    function startTimer() {
        isRunning = true;
        startPauseBtn.textContent = 'Pauze';
        timer = setInterval(updateTimer, 1000);
    }
    
    // Pause timer function
    function pauseTimer() {
        isRunning = false;
        startPauseBtn.textContent = 'Start';
        clearInterval(timer);
    }
    
    // Reset timer function
    function resetTimer() {
        pauseTimer();
        timeLeft = 15 * 60;
        updateTimerDisplay();
        timerComplete.style.display = 'none';
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update timer function
    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            timerComplete.style.display = 'block';
            pauseTimer();
            showQuote();
            playAlarmSound();
        }
    }
    
    // Show random quote
    function showQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }
    
    // Play alarm sound
    function playAlarmSound() {
        // Create audio element
        const alarm = new Audio();
        alarm.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; // Replace with your actual sound file
        alarm.play();
    }
});