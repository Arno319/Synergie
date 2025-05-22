/**
 * User Authentication System for StudentBuddy
 * Handles login, registration, and session management
 */

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and update UI
    checkUserLogin();
    
    // Get login and register forms if they exist on the page
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Setup login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            const errorElement = document.getElementById('login-error');
            
            // Simple validation
            if (!email || !password) {
                errorElement.textContent = getCurrentLanguage() === 'nl' ? 
                    'Vul alstublieft alle velden in' : 
                    'Please fill in all fields';
                return;
            }
            
            // Try to login
            if (loginUser(email, password, rememberMe)) {
                // Success - redirect to home page
                window.location.href = 'index.html';
            } else {
                // Failed login
                errorElement.textContent = getCurrentLanguage() === 'nl' ? 
                    'Ongeldige e-mail of wachtwoord' : 
                    'Invalid email or password';
            }
        });
    }
    
    // Setup register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;
            const errorElement = document.getElementById('register-error');
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                errorElement.textContent = getCurrentLanguage() === 'nl' ? 
                    'Vul alstublieft alle velden in' : 
                    'Please fill in all fields';
                return;
            }
            
            if (password !== confirmPassword) {
                errorElement.textContent = getCurrentLanguage() === 'nl' ? 
                    'Wachtwoorden komen niet overeen' : 
                    'Passwords do not match';
                return;
            }
            
            // Try to register the user
            if (registerUser(name, email, password)) {
                // Success - automatically login and redirect
                loginUser(email, password, false);
                window.location.href = 'index.html';
            } else {
                // Failed registration
                errorElement.textContent = getCurrentLanguage() === 'nl' ? 
                    'Er bestaat al een account met dit e-mailadres' : 
                    'An account with this email already exists';
            }
        });
    }
    
    // Setup logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutUser();
            updateUserInterface();
            
            // If we're on a page that requires login, redirect to login page
            const requiresLogin = document.body.classList.contains('requires-login');
            if (requiresLogin) {
                window.location.href = 'login.html';
            }
        });
    }

    // Update coin display if element exists
    updateCoinDisplay();
});

// Check if the user is logged in
function checkUserLogin() {
    const currentUser = getCurrentUser();
    updateUserInterface(currentUser);
    
    // If we're on a page that requires login and user is not logged in, redirect to login page
    const requiresLogin = document.body.classList.contains('requires-login');
    if (requiresLogin && !currentUser) {
        window.location.href = 'login.html';
    }
}

// Get the currently logged in user
function getCurrentUser() {
    // Check session storage first (logged in for this session)
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // If not in session storage, check local storage (remembered user)
    if (!user) {
        user = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    return user;
}

// Login a user
function loginUser(email, password, remember) {
    // Get all registered users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find the user with the matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user info (excluding password) in session storage
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        
        // Store in session storage (cleared when browser is closed)
        sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
        
        // If remember me is checked, also store in local storage
        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
        }
        
        return true;
    }
    
    return false;
}

// Register a new user
function registerUser(name, email, password) {
    // Get all registered users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return false; // Email already exists
    }
    
    // Create a new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // Note: In a real app, password should be hashed
        coins: 0, // Initialize coins to zero
        completedTasks: [], // Track completed tasks to prevent duplicate rewards
        playedGames: {} // Track which games the user has played and how many times
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));
    
    return true;
}

// Logout the current user
function logoutUser() {
    // Remove user data from storages
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
}

// Update the user interface based on login status
function updateUserInterface(user) {
    const userProfileContainer = document.querySelector('.user-profile');
    const loginLinkContainer = document.querySelector('.login-link');
    
    if (!userProfileContainer || !loginLinkContainer) return;
    
    if (user) {
        // User is logged in - show profile and hide login link
        userProfileContainer.style.display = 'flex';
        loginLinkContainer.style.display = 'none';
        
        // Update user name
        const userNameElement = userProfileContainer.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }

        // Update coin display if it exists
        updateCoinDisplay();
    } else {
        // User is not logged in - hide profile and show login link
        userProfileContainer.style.display = 'none';
        loginLinkContainer.style.display = 'flex';
    }
}

// Helper function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'nl';
}

// Coin Management Functions

// Award coins to a user for completing a task
function awardCoins(taskId, coinAmount = 1) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Get the user's complete data with coins from storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;
    
    // Check if task was already completed to prevent duplicate rewards
    if (users[userIndex].completedTasks && users[userIndex].completedTasks.includes(taskId)) {
        return false; // Task already completed
    }
    
    // Add coins and mark task as completed
    if (!users[userIndex].coins) users[userIndex].coins = 0;
    if (!users[userIndex].completedTasks) users[userIndex].completedTasks = [];
    
    users[userIndex].coins += coinAmount;
    users[userIndex].completedTasks.push(taskId);
    
    // Update user in storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update the currentUser in session storage
    currentUser.coins = users[userIndex].coins;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update coin display
    updateCoinDisplay();
    
    return true;
}

// Spend coins to play a game
function spendCoins(gameId, costCoins = 2) {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: "Not logged in" };
    
    // Get the user's complete data with coins from storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return { success: false, message: "User not found" };
    
    // Check if user has enough coins
    if (!users[userIndex].coins || users[userIndex].coins < costCoins) {
        return { 
            success: false, 
            message: getCurrentLanguage() === 'nl' ? 
                "Niet genoeg munten! Je hebt er " + costCoins + " nodig." : 
                "Not enough coins! You need " + costCoins + "."
        };
    }
    
    // Track this game play
    if (!users[userIndex].playedGames) users[userIndex].playedGames = {};
    if (!users[userIndex].playedGames[gameId]) users[userIndex].playedGames[gameId] = 0;
    users[userIndex].playedGames[gameId]++;
    
    // Deduct coins
    users[userIndex].coins -= costCoins;
    
    // Update user in storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update the currentUser in session storage
    currentUser.coins = users[userIndex].coins;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update coin display
    updateCoinDisplay();
    
    return { success: true, message: "Game unlocked!" };
}

// Get the user's current coin count
function getUserCoins() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
    
    // Get the user's complete data with coins from storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    return user && user.coins ? user.coins : 0;
}

// Update the coin display in the header
function updateCoinDisplay() {
    const coinDisplay = document.getElementById('coin-display');
    if (!coinDisplay) return;
    
    const coins = getUserCoins();
    coinDisplay.textContent = coins;
}

// Show a notification about coins earned
function showCoinNotification(amount) {
    const notification = document.createElement('div');
    notification.className = 'coin-notification';
    notification.innerHTML = `
        <div class="coin-icon">🪙</div>
        <div class="coin-message">
            <span>+${amount}</span>
            <span>${getCurrentLanguage() === 'nl' ? 'Munt verdiend!' : 'Coin earned!'}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
