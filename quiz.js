const Quiz = {
    questions: [
        {
            question: "Wat is de hoofdstad van Australië?",
            options: ["Sydney", "Canberra", "Melbourne", "Perth"],
            correctIndex: 1
        },
        {
            question: "Welk element heeft het symbool 'O' in het periodiek systeem?",
            options: ["Osmium", "Goud", "Zuurstof", "Zilver"],
            correctIndex: 2
        },
        {
            question: "Wie schreef het boek 'Harry Potter en de Steen der Wijzen'?",
            options: ["J.K. Rowling", "George R.R. Martin", "Stephen King", "Roald Dahl"],
            correctIndex: 0
        },
        {
            question: "Wat is de kleinste planeet in ons zonnestelsel?",
            options: ["Mars", "Venus", "Mercurius", "Pluto (geen planeet meer)"],
            correctIndex: 2
        },
        {
            question: "Welke taal wordt het meest gesproken ter wereld?",
            options: ["Engels", "Spaans", "Mandarijn Chinees", "Hindi"],
            correctIndex: 2
        },
        {
            question: "Hoeveel botten heeft een volwassen menselijk lichaam?",
            options: ["186", "206", "226", "248"],
            correctIndex: 1
        },
        {
            question: "Welk land heeft de vorm van een laars?",
            options: ["Portugal", "Griekenland", "Italië", "Turkije"],
            correctIndex: 2
        },
        {
            question: "Welk dier staat bekend als 'de koning van de jungle'?",
            options: ["Tijger", "Leeuw", "Panter", "Jaguar"],
            correctIndex: 1
        },
        {
            question: "Uit hoeveel spelers bestaat een volleybalteam?",
            options: ["5", "6", "7", "8"],
            correctIndex: 1
        },
        {
            question: "Wat is de hoofdstad van Japan?",
            options: ["Seoul", "Beijing", "Tokyo", "Osaka"],
            correctIndex: 2
        }
    ],

    init() {
        console.log("Quiz initializing...");
        
        this.elements = {
            startBtn: document.getElementById('start-quiz'),
            quizIntro: document.getElementById('quiz-intro'),
            questionSection: document.getElementById('question-section'),
            questionContainer: document.getElementById('question-container'),
            nextBtn: document.getElementById('next-btn'),
            prevBtn: document.getElementById('prev-btn'),
            progressBar: document.getElementById('progress-bar'),
            timer: document.getElementById('timer'),
            resultsContainer: document.getElementById('results-container'),
            restartBtn: document.getElementById('restart-quiz')
        };

        this.state = {
            currentQuestion: 0,
            score: 0,
            timerInterval: null,
            selectedQuestions: [],
            userAnswers: new Array(10).fill(null)
        };

        // Add event listeners
        this.elements.startBtn.addEventListener('click', () => this.startQuiz());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.prevBtn.addEventListener('click', () => this.prevQuestion());
        this.elements.restartBtn.addEventListener('click', () => this.startQuiz());

        // Add language handling
        this.currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'nl';
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => this.changeLanguage(btn.dataset.lang));
        });
        
        this.updateUILanguage();

        console.log("Quiz initialized");
    },

    startQuiz() {
        console.log("Starting quiz...");
        
        // Reset state
        this.state.currentQuestion = 0;
        this.state.score = 0;
        this.state.userAnswers = new Array(10).fill(null);
        this.state.selectedQuestions = this.getRandomQuestions(10);

        // Reset UI
        this.elements.quizIntro.style.display = 'none';
        this.elements.questionSection.style.display = 'block';
        this.elements.resultsContainer.style.display = 'none';
        this.elements.nextBtn.textContent = 'Volgende';

        // Load first question
        this.loadQuestion();
        this.startTimer();
        this.updateProgress();
        
        console.log("Quiz started");
    },

    loadQuestion() {
        console.log(`Loading question ${this.state.currentQuestion + 1}`);
        
        // Get current question
        const question = this.state.selectedQuestions[this.state.currentQuestion];
        
        if (!question) {
            console.error("No question found at index", this.state.currentQuestion);
            return;
        }

        // Translate question and options if needed
        let questionText = question.question;
        let optionsArray = [...question.options];
        
        if (this.currentLang === 'en') {
            questionText = questionTranslations.en[questionText] || questionText;
            optionsArray = optionsArray.map(option => optionTranslations.en[option] || option);
        }

        // Build question HTML
        const optionsHtml = optionsArray.map((option, i) => {
            const isSelected = this.state.userAnswers[this.state.currentQuestion] === i;
            return `<div class="option-item ${isSelected ? 'selected' : ''}" data-index="${i}">${option}</div>`;
        }).join('');

        // Update question container with new question
        this.elements.questionContainer.innerHTML = `
            <div class="question-text">
                ${this.state.currentQuestion + 1}. ${questionText}
            </div>
            <div class="options-list">
                ${optionsHtml}
            </div>
        `;

        // Add click events to new option elements
        const options = this.elements.questionContainer.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', (e) => this.selectAnswer(parseInt(e.target.dataset.index)));
        });

        // Update navigation state
        this.updateNavigation();
        this.updateProgress();
        
        console.log("Question loaded");
    },

    selectAnswer(index) {
        console.log(`Selected answer: ${index}`);
        
        this.state.userAnswers[this.state.currentQuestion] = index;
        
        // Update UI
        const options = this.elements.questionContainer.querySelectorAll('.option-item');
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
        
        // Enable next button
        this.elements.nextBtn.disabled = false;
        
        // Update text for last question
        if (this.state.currentQuestion === this.state.selectedQuestions.length - 1) {
            this.elements.nextBtn.textContent = 'Voltooien';
        }
        
        console.log("Answer selected");
    },

    nextQuestion() {
        console.log("Moving to next question");
        
        if (this.state.currentQuestion < this.state.selectedQuestions.length - 1) {
            this.state.currentQuestion++;
            this.loadQuestion();
        } else {
            this.showResults();
        }
        
        console.log(`New question index: ${this.state.currentQuestion}`);
    },

    prevQuestion() {
        console.log("Moving to previous question");
        
        if (this.state.currentQuestion > 0) {
            this.state.currentQuestion--;
            this.loadQuestion();
        }
        
        console.log(`New question index: ${this.state.currentQuestion}`);
    },

    updateNavigation() {
        // Disable previous button on first question
        this.elements.prevBtn.disabled = this.state.currentQuestion === 0;
        
        // Disable next button if no answer selected
        this.elements.nextBtn.disabled = this.state.userAnswers[this.state.currentQuestion] === null;
        
        // Change text on last question
        if (this.state.currentQuestion === this.state.selectedQuestions.length - 1) {
            this.elements.nextBtn.textContent = 'Voltooien';
        } else {
            this.elements.nextBtn.textContent = 'Volgende';
        }
        
        console.log("Navigation updated");
    },

    updateProgress() {
        const progress = ((this.state.currentQuestion + 1) / this.state.selectedQuestions.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        console.log(`Progress: ${progress}%`);
    },

    startTimer() {
        console.log("Starting timer");
        
        let seconds = 0;
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        
        this.state.timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            this.elements.timer.textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    getRandomQuestions(count) {
        console.log(`Getting ${count} random questions`);
        
        // Make a copy and shuffle
        const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
        
        // Take only what we need
        return shuffled.slice(0, count);
    },

    showResults() {
        console.log("Showing results");
        
        // Stop timer
        clearInterval(this.state.timerInterval);
        
        // Calculate score
        this.calculateScore();
        
        // Update UI
        this.elements.questionSection.style.display = 'none';
        this.elements.resultsContainer.style.display = 'block';
        
        // Update score display
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            const t = translations[this.currentLang];
            scoreDisplay.textContent = `${this.state.score}/${this.state.selectedQuestions.length} ${t.correctText}`;
        }
        
        // Create review list
        this.createReviewList();
        
        console.log(`Final score: ${this.state.score}`);
    },

    calculateScore() {
        this.state.score = this.state.userAnswers.reduce((total, answer, index) => {
            if (answer === this.state.selectedQuestions[index].correctIndex) {
                return total + 1;
            }
            return total;
        }, 0);
    },

    createReviewList() {
        console.log("Creating review list");
        
        const reviewList = document.getElementById("review-list");
        if (!reviewList) return;
        
        const t = translations[this.currentLang];
        let reviewHtml = '';
        
        this.state.selectedQuestions.forEach((question, index) => {
            const userAnswer = this.state.userAnswers[index];
            const isCorrect = userAnswer === question.correctIndex;
            
            // Translate question and answers if needed
            let questionText = question.question;
            let options = [...question.options];
            
            if (this.currentLang === 'en') {
                questionText = questionTranslations.en[questionText] || questionText;
                options = options.map(option => optionTranslations.en[option] || option);
            }
            
            reviewHtml += `
                <div class="review-item ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                    <div class="review-question">${index + 1}. ${questionText}</div>
                    <div class="review-answers">
                        <div class="review-your-answer">
                            <strong>${t.yourAnswer}</strong> ${userAnswer !== null ? options[userAnswer] : t.noAnswer}
                        </div>
                        <div class="review-correct-answer">
                            <strong>${t.correctAnswer}</strong> ${options[question.correctIndex]}
                        </div>
                    </div>
                </div>
            `;
        });
        
        reviewList.innerHTML = reviewHtml;
        console.log("Review list created");
    },

    changeLanguage(lang) {
        this.currentLang = lang;
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        this.updateUILanguage();
    },

    updateUILanguage() {
        const t = translations[this.currentLang];
        const introT = introTranslations[this.currentLang];
        
        // Update quiz intro texts
        document.querySelector('.page-title h1').textContent = introT.pageTitle;
        document.querySelector('.quiz-intro h2').textContent = introT.quizTitle;
        
        // Update the intro paragraphs (first two paragraphs in quiz-intro)
        const introParas = document.querySelectorAll('.quiz-intro p');
        if (introParas.length >= 2) {
            introParas[0].textContent = introT.introText1;
            introParas[1].textContent = introT.introText2;
        }
        
        // Update static elements
        this.elements.startBtn.textContent = t.startButton;
        this.elements.prevBtn.textContent = t.prevButton;
        this.elements.restartBtn.textContent = t.restartButton;
        
        // Update dynamic elements based on state
        if (this.state.currentQuestion === this.state.selectedQuestions.length - 1) {
            this.elements.nextBtn.textContent = t.finishButton;
        } else {
            this.elements.nextBtn.textContent = t.nextButton;
        }
        
        // Update results section if visible
        if (this.elements.resultsContainer.style.display === 'block') {
            document.querySelector('.results-container h2').textContent = t.resultsTitle;
            document.querySelector('.results-review h3').textContent = t.answersOverview;
            
            // Update score display
            const scoreDisplay = document.getElementById('score-display');
            if (scoreDisplay) {
                const score = this.state.score;
                scoreDisplay.textContent = `${score}/${this.state.selectedQuestions.length} ${t.correctText}`;
            }
            
            // Update feedback text based on score
            const feedbackText = document.getElementById('feedback-text');
            const percentage = (this.state.score / this.state.selectedQuestions.length) * 100;
            
            if (percentage === 100) {
                feedbackText.textContent = t.feedback.perfect;
            } else if (percentage >= 80) {
                feedbackText.textContent = t.feedback.excellent;
            } else if (percentage >= 60) {
                feedbackText.textContent = t.feedback.good;
            } else if (percentage >= 40) {
                feedbackText.textContent = t.feedback.okay;
            } else {
                feedbackText.textContent = t.feedback.needsWork;
            }
            
            // Update review items
            document.querySelectorAll('.review-your-answer').forEach(item => {
                const answerText = item.innerHTML.split(':')[1].trim();
                item.innerHTML = `<strong>${t.yourAnswer}</strong> ${answerText}`;
            });
            
            document.querySelectorAll('.review-correct-answer').forEach(item => {
                const answerText = item.innerHTML.split(':')[1].trim();
                item.innerHTML = `<strong>${t.correctAnswer}</strong> ${answerText}`;
            });
        }
        
        // Update current question if visible
        if (this.elements.questionSection.style.display === 'block' && this.state.selectedQuestions.length > 0) {
            this.loadQuestion(); // Reload current question with new language
        }
    }
};

// Add translations for the quiz
const translations = {
    nl: {
        startButton: "Start de Quiz",
        nextButton: "Volgende",
        prevButton: "Vorige",
        finishButton: "Voltooien",
        correctText: "correct",
        restartButton: "Opnieuw Proberen",
        resultsTitle: "Quiz Resultaten",
        answersOverview: "Overzicht van je antwoorden:",
        yourAnswer: "Jouw antwoord:",
        correctAnswer: "Juiste antwoord:",
        noAnswer: "Geen antwoord",
        feedback: {
            perfect: "Perfect! Je bent een echte kenner!",
            excellent: "Uitstekend! Je hebt een indrukwekkende algemene kennis.",
            good: "Goed gedaan! Je hebt een stevige algemene kennis.",
            okay: "Niet slecht! Er is nog ruimte voor verbetering.",
            needsWork: "Blijf oefenen! Deze onderwerpen vergen wat extra aandacht."
        }
    },
    en: {
        startButton: "Start Quiz",
        nextButton: "Next",
        prevButton: "Previous",
        finishButton: "Finish",
        correctText: "correct",
        restartButton: "Try Again",
        resultsTitle: "Quiz Results",
        answersOverview: "Overview of your answers:",
        yourAnswer: "Your answer:",
        correctAnswer: "Correct answer:",
        noAnswer: "No answer",
        feedback: {
            perfect: "Perfect! You're a true expert!",
            excellent: "Excellent! You have impressive general knowledge.",
            good: "Well done! You have solid general knowledge.",
            okay: "Not bad! There's still room for improvement.",
            needsWork: "Keep practicing! These topics require more attention."
        }
    }
};

// Add translations for quiz intro texts
const introTranslations = {
    nl: {
        pageTitle: "Even een pauze?",
        quizTitle: "Verfrissende Kennisquiz",
        introText1: "Neem even een pauze van je studie en test je algemene kennis met deze korte quiz. De perfecte manier om je gedachten te verzetten!",
        introText2: "De quiz bestaat uit 10 willekeurige vragen en duurt ongeveer 5 minuten."
    },
    en: {
        pageTitle: "Need a break?",
        quizTitle: "Refreshing Knowledge Quiz",
        introText1: "Take a break from studying and test your general knowledge with this short quiz. The perfect way to clear your mind!",
        introText2: "The quiz consists of 10 random questions and takes about 5 minutes."
    }
};

// Add translations for quiz questions
const questionTranslations = {
    en: {
        "Wat is de hoofdstad van Australië?": "What is the capital of Australia?",
        "Welk element heeft het symbool 'O' in het periodiek systeem?": "Which element has the symbol 'O' in the periodic table?",
        "Wie schreef het boek 'Harry Potter en de Steen der Wijzen'?": "Who wrote the book 'Harry Potter and the Philosopher's Stone'?",
        "Wat is de kleinste planeet in ons zonnestelsel?": "What is the smallest planet in our solar system?",
        "Welke taal wordt het meest gesproken ter wereld?": "Which language is spoken most in the world?",
        "Hoeveel botten heeft een volwassen menselijk lichaam?": "How many bones does an adult human body have?",
        "Welk land heeft de vorm van een laars?": "Which country has the shape of a boot?",
        "Welk dier staat bekend als 'de koning van de jungle'?": "Which animal is known as 'the king of the jungle'?",
        "Uit hoeveel spelers bestaat een volleybalteam?": "How many players are there in a volleyball team?",
        "Wat is de hoofdstad van Japan?": "What is the capital of Japan?"
    }
};

// Add translations for quiz options
const optionTranslations = {
    en: {
        "Sydney": "Sydney",
        "Canberra": "Canberra",
        "Melbourne": "Melbourne",
        "Perth": "Perth",
        "Osmium": "Osmium",
        "Goud": "Gold",
        "Zuurstof": "Oxygen",
        "Zilver": "Silver",
        "J.K. Rowling": "J.K. Rowling",
        "George R.R. Martin": "George R.R. Martin",
        "Stephen King": "Stephen King",
        "Roald Dahl": "Roald Dahl",
        "Mars": "Mars",
        "Venus": "Venus",
        "Mercurius": "Mercury",
        "Pluto (geen planeet meer)": "Pluto (no longer a planet)",
        "Engels": "English",
        "Spaans": "Spanish",
        "Mandarijn Chinees": "Mandarin Chinese",
        "Hindi": "Hindi",
        "186": "186",
        "206": "206",
        "226": "226",
        "248": "248",
        "Portugal": "Portugal",
        "Griekenland": "Greece",
        "Italië": "Italy",
        "Turkije": "Turkey",
        "Tijger": "Tiger",
        "Leeuw": "Lion",
        "Panter": "Panther",
        "Jaguar": "Jaguar",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "Seoul": "Seoul",
        "Beijing": "Beijing",
        "Tokyo": "Tokyo",
        "Osaka": "Osaka"
    }
};

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing quiz");
    Quiz.init();
});
