// Authentication System

class AuthSystem {
    constructor() {
        this.masterPassword = 'gamer5656';
        this.isAuthenticated = false;
        this.sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
        this.init();
    }

    init() {
        this.checkSession();
        this.setupEventListeners();
    }

    checkSession() {
        const session = localStorage.getItem('tradersDojoSession');
        if (session) {
            const sessionData = JSON.parse(session);
            if (Date.now() - sessionData.timestamp < this.sessionDuration) {
                this.isAuthenticated = true;
                this.updateSession();
            } else {
                this.logout();
            }
        }
    }

    updateSession() {
        const sessionData = {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        localStorage.setItem('tradersDojoSession', JSON.stringify(sessionData));
    }

    login(password) {
        if (password === this.masterPassword) {
            this.isAuthenticated = true;
            this.updateSession();
            
            // Create success effects
            this.createLoginEffects();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
            return true;
        } else {
            this.createErrorEffects();
            return false;
        }
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('tradersDojoSession');
        window.location.href = 'login.html';
    }

    createLoginEffects() {
        // Create particle explosion
        const container = document.getElementById('particlesContainer');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.8)`;
            particle.style.boxShadow = '0 0 20px currentColor';
            particle.style.borderRadius = '50%';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            const distance = Math.random() * 200 + 100;
            
            particle.style.transition = `all 1s cubic-bezier(0.4, 0, 0.2, 1)`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1100);
        }
        
        // Play success sound
        this.playSound('success');
    }

    createErrorEffects() {
        // Create error particles
        const container = document.getElementById('particlesContainer');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 8 + 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.background = '#ef4444';
            particle.style.boxShadow = '0 0 15px #ef4444';
            particle.style.borderRadius = '50%';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            
            particle.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 700);
        }
        
        // Play error sound
        this.playSound('error');
    }

    playSound(type) {
        const sounds = {
            success: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-1092.mp3'
        };
        
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Auto-play might be blocked
            });
        }
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('password').value;
                this.login(password);
            });
        }
        
        // Auto-logout on inactivity
        this.setupInactivityTimer();
    }

    setupInactivityTimer() {
        let timeout;
        
        const resetTimer = () => {
            clearTimeout(timeout);
            if (this.isAuthenticated) {
                timeout = setTimeout(() => {
                    this.logout();
                }, 30 * 60 * 1000); // 30 minutes
            }
        };
        
        // Reset on user activity
        ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer();
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }
}

// Initialize auth system
window.auth = new AuthSystem();

// Protect main page
if (window.location.pathname.endsWith('index.html') || 
    window.location.pathname === '/') {
    if (!window.auth.isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Export for use in other files
window.AuthSystem = AuthSystem;
