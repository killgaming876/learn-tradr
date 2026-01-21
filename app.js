// TRADER'S DOJO - Core Application Logic

class TradersDojo {
    constructor() {
        this.state = {
            user: {
                level: 7,
                xp: 1245,
                totalTrades: 248,
                totalProfit: 4280,
                winRate: 68,
                winStreak: 12,
                trainingHours: 48,
                practiceBalance: 10000,
                practiceAccuracy: 72,
                practiceStreak: 8,
                practiceRank: 42
            },
            currentSection: 'dashboard',
            aiMessages: [],
            chartData: null,
            currentTrade: null,
            lessons: [],
            tools: [],
            settings: {}
        };

        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAIInteraction();
        this.animateElements();
        this.startBackgroundEffects();
    }

    loadUserData() {
        // Load from localStorage or API
        const savedData = localStorage.getItem('tradersDojoData');
        if (savedData) {
            this.state = JSON.parse(savedData);
        }
        
        this.updateUI();
    }

    saveUserData() {
        localStorage.setItem('tradersDojoData', JSON.stringify(this.state));
    }

    updateUI() {
        // Update all UI elements with current state
        document.getElementById('userLevel').textContent = this.state.user.level;
        document.getElementById('userXP').textContent = this.state.user.xp.toLocaleString();
        document.getElementById('totalTrades').textContent = this.state.user.totalTrades;
        document.getElementById('totalProfit').textContent = `+$${this.state.user.totalProfit}`;
        document.getElementById('currentStreak').textContent = this.state.user.winStreak;
        document.getElementById('trainingHours').textContent = `${this.state.user.trainingHours}h`;
        document.getElementById('winRate').textContent = `${this.state.user.winRate}%`;
        document.getElementById('xpFill').style.width = `${(this.state.user.xp % 1000) / 10}%`;
        document.getElementById('practiceBalance').textContent = `$${this.state.user.practiceBalance.toLocaleString()}`;
        document.getElementById('practiceAccuracy').textContent = `${this.state.user.practiceAccuracy}%`;
        document.getElementById('practiceStreak').textContent = this.state.user.practiceStreak;
        document.getElementById('practiceRank').textContent = `#${this.state.user.practiceRank}`;
        document.getElementById('quickBalance').textContent = `$${this.state.user.practiceBalance.toLocaleString()}`;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
                this.createParticleEffect(e.clientX, e.clientY);
            });
        });

        // Trading buttons
        document.getElementById('quickBuyBtn').addEventListener('click', () => this.executeTrade('buy'));
        document.getElementById('quickSellBtn').addEventListener('click', () => this.executeTrade('sell'));
        document.getElementById('executeTradeBtn').addEventListener('click', () => this.confirmTrade());

        // Position slider
        const slider = document.getElementById('positionSlider');
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('positionValue').textContent = parseInt(value).toLocaleString();
            const risk = (value / this.state.user.practiceBalance * 100).toFixed(1);
            document.getElementById('riskPercent').textContent = `${risk}%`;
        });

        // AI Chat
        document.getElementById('sendMessageBtn').addEventListener('click', () => this.sendAIMessage());
        document.getElementById('mentorInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAIMessage();
        });

        // Chart controls
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChart(btn.dataset.tf);
            });
        });

        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => this.useTool(btn.dataset.tool));
        });

        // Quick actions
        document.getElementById('quickChartBtn').addEventListener('click', () => this.switchSection('chart'));
        document.getElementById('quickLessonBtn').addEventListener('click', () => this.switchSection('learn'));
        document.getElementById('quickTradeBtn').addEventListener('click', () => this.switchSection('practice'));
        document.getElementById('quickQuizBtn').addEventListener('click', () => this.startQuiz());

        // Refresh chart
        document.getElementById('newChartDataBtn').addEventListener('click', () => this.generateNewChartData());
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `${section}Section`) {
                sec.classList.add('active');
            }
        });

        this.state.currentSection = section;
        
        // Play transition sound
        this.playSound('click');
        
        // Add section-specific effects
        this.addSectionEffects(section);
    }

    executeTrade(direction) {
        // Update button states
        document.querySelectorAll('.trade-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (direction === 'buy') {
            document.getElementById('quickBuyBtn').classList.add('selected');
        } else {
            document.getElementById('quickSellBtn').classList.add('selected');
        }
        
        // Show analysis
        this.showTradeAnalysis(direction);
    }

    confirmTrade() {
        const direction = document.querySelector('.trade-btn.selected') ? 
            document.querySelector('.trade-btn.selected').classList.contains('buy') ? 'buy' : 'sell' : null;
        
        if (!direction) {
            this.showNotification('Please select BUY or SELL first', 'warning');
            return;
        }

        const position = parseInt(document.getElementById('positionValue').textContent.replace(',', ''));
        
        if (position > this.state.user.practiceBalance) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }

        // Simulate trade outcome
        const isWin = Math.random() > 0.4;
        const profitMultiplier = isWin ? 0.1 : -0.05;
        const profit = Math.round(position * profitMultiplier);
        
        // Update user state
        this.state.user.practiceBalance += profit;
        this.state.user.totalTrades++;
        if (isWin) {
            this.state.user.winStreak++;
            this.state.user.totalProfit += profit;
        } else {
            this.state.user.winStreak = 0;
        }
        
        // Update win rate
        const totalWins = Math.round(this.state.user.totalTrades * (this.state.user.winRate / 100));
        const newWins = totalWins + (isWin ? 1 : 0);
        this.state.user.winRate = Math.round((newWins / this.state.user.totalTrades) * 100);
        
        // Add XP
        this.state.user.xp += isWin ? 25 : 10;
        
        // Check level up
        if (this.state.user.xp >= this.state.user.level * 1000) {
            this.state.user.level++;
            this.showLevelUp();
        }
        
        // Save and update UI
        this.saveUserData();
        this.updateUI();
        
        // Show result
        this.showTradeResult(direction, isWin, profit);
        
        // Play sound
        this.playSound(isWin ? 'success' : 'trade');
        
        // Add AI feedback
        this.addAIFeedback(direction, isWin, profit);
    }

    showTradeResult(direction, isWin, profit) {
        const result = document.createElement('div');
        result.className = `trade-result-notification ${isWin ? 'win' : 'loss'}`;
        result.innerHTML = `
            <div class="result-icon">
                <i class="fas ${isWin ? 'fa-trophy' : 'fa-exclamation-triangle'}"></i>
            </div>
            <div class="result-details">
                <h4>${isWin ? 'Trade Won!' : 'Trade Lost'}</h4>
                <p>${direction.toUpperCase()} • ${profit > 0 ? '+' : ''}$${Math.abs(profit)}</p>
                <small>${isWin ? 'Excellent analysis!' : 'Review your strategy'}</small>
            </div>
        `;
        
        document.body.appendChild(result);
        
        // Animate in
        setTimeout(() => result.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            result.classList.remove('show');
            setTimeout(() => result.remove(), 300);
        }, 3000);
    }

    showTradeAnalysis(direction) {
        // Generate random analysis
        const analyses = {
            buy: [
                "Bullish momentum detected on higher timeframe",
                "Strong support holding, expecting bounce",
                "RSI oversold, potential reversal incoming",
                "Volume increasing on up moves"
            ],
            sell: [
                "Resistance holding strong, expecting pullback",
                "Bearish divergence forming on RSI",
                "Volume decreasing on up moves",
                "Lower highs pattern developing"
            ]
        };
        
        const randomAnalysis = analyses[direction][Math.floor(Math.random() * analyses[direction].length)];
        
        this.addAIMessage(`Analysis for ${direction.toUpperCase()}: ${randomAnalysis}`);
    }

    sendAIMessage() {
        const input = document.getElementById('mentorInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addAIMessage(message, 'user');
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const responses = this.generateAIResponse(message);
            this.addAIMessage(responses);
        }, 1000);
    }

    addAIMessage(message, sender = 'ai') {
        const chat = document.getElementById('mentorMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
        
        // Add to state
        this.state.aiMessages.push({ sender, message, time: new Date() });
    }

    generateAIResponse(userMessage) {
        const responses = {
            greeting: [
                "Welcome back! Ready to conquer the markets today?",
                "Hello trader! I've been analyzing market patterns for you.",
                "Great to see you! Let's make today profitable."
            ],
            trend: [
                "Always trade with the trend. The trend is your friend until it ends.",
                "Check multiple timeframes to confirm trend direction.",
                "Trend lines should connect at least two swing points."
            ],
            risk: [
                "Never risk more than 2% of your capital on a single trade.",
                "Risk management is more important than profit potential.",
                "Your stop loss should be based on technical levels, not arbitrary amounts."
            ],
            psychology: [
                "Trading is 80% psychology, 20% strategy.",
                "Emotions are your worst enemy in trading.",
                "Develop a trading plan and stick to it religiously."
            ],
            patterns: [
                "Chart patterns repeat because human psychology doesn't change.",
                "Look for patterns at key support/resistance levels for higher probability.",
                "Volume confirmation is crucial for pattern validity."
            ],
            default: [
                "That's an interesting point! Could you elaborate?",
                "Based on current market conditions, I'd recommend caution.",
                "Have you considered the higher timeframe context?",
                "Let me analyze that and get back to you with specific insights."
            ]
        };
        
        const message = userMessage.toLowerCase();
        let category = 'default';
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            category = 'greeting';
        } else if (message.includes('trend') || message.includes('direction')) {
            category = 'trend';
        } else if (message.includes('risk') || message.includes('stop loss') || message.includes('position')) {
            category = 'risk';
        } else if (message.includes('emotion') || message.includes('psychology') || message.includes('mind')) {
            category = 'psychology';
        } else if (message.includes('pattern') || message.includes('chart') || message.includes('candle')) {
            category = 'patterns';
        }
        
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    useTool(tool) {
        const toolMessages = {
            trendline: "Draw trendlines by connecting swing highs/lows. Valid trendlines have at least two touches.",
            horizontal: "Support/resistance levels are areas where price has reversed multiple times.",
            fibonacci: "Fibonacci retracement: Draw from swing high to low. Key levels: 0.382, 0.5, 0.618.",
            patterns: "Common patterns: Head & Shoulders, Double Top/Bottom, Triangles, Flags.",
            indicators: "Combine indicators: RSI for overbought/oversold, MACD for trend changes.",
            clear: "Analysis tools cleared. Ready for fresh perspective."
        };
        
        this.addAIMessage(toolMessages[tool]);
        this.createToolEffect(tool);
    }

    createToolEffect(tool) {
        const colors = {
            trendline: '#3b82f6',
            horizontal: '#8b5cf6',
            fibonacci: '#ec4899',
            patterns: '#10b981',
            indicators: '#f59e0b',
            clear: '#ef4444'
        };
        
        this.createParticleBurst(colors[tool], 15);
    }

    updateChart(timeframe) {
        // In real implementation, this would fetch new chart data
        this.addAIMessage(`Switched to ${timeframe} timeframe. Analyzing market structure...`);
        
        // Simulate chart update
        this.generateNewChartData();
    }

    generateNewChartData() {
        // Simulate new chart data
        const chart = Chart.getChart('marketChart');
        if (chart) {
            chart.data.datasets[0].data = this.generateRandomPriceData(50, 45000, 46000);
            chart.update();
            
            this.createParticleBurst('#3b82f6', 20);
            this.addAIMessage("New market data loaded. Look for emerging patterns.");
        }
    }

    generateRandomPriceData(count, min, max) {
        const data = [];
        let current = (min + max) / 2;
        const volatility = (max - min) * 0.02;
        
        for (let i = 0; i < count; i++) {
            current += (Math.random() - 0.5) * volatility;
            current = Math.max(min, Math.min(max, current));
            data.push(current);
        }
        
        return data;
    }

    startQuiz() {
        this.showNotification('Starting trading quiz...', 'info');
        setTimeout(() => {
            this.switchSection('learn');
            this.addAIMessage("Let's test your knowledge with a quick quiz!");
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    showLevelUp() {
        const levelUp = document.createElement('div');
        levelUp.className = 'level-up-notification';
        levelUp.innerHTML = `
            <div class="level-up-content">
                <i class="fas fa-trophy"></i>
                <h2>LEVEL UP!</h2>
                <p>You've reached Level ${this.state.user.level}</p>
                <small>New features unlocked!</small>
            </div>
        `;
        
        document.body.appendChild(levelUp);
        
        // Add confetti
        this.createConfettiEffect();
        
        setTimeout(() => levelUp.classList.add('show'), 10);
        
        setTimeout(() => {
            levelUp.classList.remove('show');
            setTimeout(() => levelUp.remove(), 500);
        }, 4000);
    }

    createParticleEffect(x, y) {
        const container = document.getElementById('backgroundParticles');
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 8 + 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 40 + 20;
            
            particle.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 600);
        }
    }

    createParticleBurst(color, count) {
        const container = document.getElementById('backgroundParticles');
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 20px ${color}`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            
            particle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 900);
        }
    }

    createConfettiEffect() {
        const container = document.getElementById('backgroundParticles');
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle';
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = Math.random() * 15 + 5 + 'px';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.3;
            const distance = Math.random() * 400 + 200;
            const rotation = Math.random() * 720 - 360;
            
            confetti.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 500}px) rotate(${rotation}deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            setTimeout(() => confetti.remove(), 1600);
        }
    }

    playSound(type) {
        const sounds = {
            click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
            trade: 'https://assets.mixkit.co/sfx/preview/mixkit-cash-register-bell-sale-1108.mp3',
            success: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-1092.mp3'
        };
        
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Auto-play might be blocked, ignore
            });
        }
    }

    startAIInteraction() {
        // Initial AI messages
        setTimeout(() => {
            this.addAIMessage("Welcome to Trader's Dojo! I'm Sensei Kuro, your AI trading mentor.");
        }, 1000);
        
        setTimeout(() => {
            this.addAIMessage("I'll guide you through market analysis, risk management, and trading psychology.");
        }, 3000);
        
        setTimeout(() => {
            this.addAIMessage("Ready to begin your trading journey? Let's start with some basic concepts.");
        }, 5000);
    }

    addAIFeedback(direction, isWin, profit) {
        const feedbacks = {
            win: [
                "Excellent trade execution! You read the market correctly.",
                "Perfect timing on that entry! Your analysis was spot on.",
                "Great risk management on that winning trade!"
            ],
            loss: [
                "Every loss is a lesson. What can we learn from this?",
                "The market gave us feedback. Let's analyze what happened.",
                "Risk was controlled well. Now let's refine our entry criteria."
            ]
        };
        
        const feedback = isWin ? feedbacks.win : feedbacks.loss;
        const randomFeedback = feedback[Math.floor(Math.random() * feedback.length)];
        
        setTimeout(() => {
            this.addAIMessage(randomFeedback);
        }, 1500);
    }

    addSectionEffects(section) {
        const effects = {
            chart: () => {
                this.createParticleBurst('#3b82f6', 10);
                this.addAIMessage("Chart analysis mode activated. Let me know what patterns you see!");
            },
            practice: () => {
                this.createParticleBurst('#10b981', 10);
                this.addAIMessage("Practice arena ready! Remember to use proper risk management.");
            },
            learn: () => {
                this.createParticleBurst('#8b5cf6', 10);
                this.addAIMessage("Learning mode engaged. Let's expand your trading knowledge!");
            }
        };
        
        if (effects[section]) {
            effects[section]();
        }
    }

    animateElements() {
        // Add floating animation to random elements
        document.querySelectorAll('.stat-card, .lesson-item, .tool-btn').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('fade-in-up');
        });
    }

    startBackgroundEffects() {
        // Continuous subtle particle effects
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createBackgroundParticle();
            }
        }, 1000);
    }

    createBackgroundParticle() {
        const container = document.getElementById('backgroundParticles');
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        particle.style.background = `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.1})`;
        particle.style.borderRadius = '50%';
        
        const distance = Math.random() * 200 + 100;
        const duration = Math.random() * 10 + 10;
        
        particle.style.transition = `all ${duration}s linear`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transform = `translateY(${window.innerHeight + 100}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => particle.remove(), duration * 1000);
    }

    initializeCharts() {
        // Initialize all charts
        this.initializeMarketChart();
        this.initializePracticeChart();
    }

    initializeMarketChart() {
        const ctx = document.getElementById('marketChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 50}, (_, i) => `C${i}`),
                datasets: [{
                    label: 'BTC/USD',
                    data: this.generateRandomPriceData(50, 45000, 46000),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: 'x'
                        },
                        pan: {
                            enabled: true,
                            mode: 'x'
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    initializePracticeChart() {
        const ctx = document.getElementById('practiceChart').getContext('2d');
        new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'Practice',
                    data: this.generateCandleData(30),
                    color: {
                        up: '#10b981',
                        down: '#ef4444'
                    },
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    generateCandleData(count) {
        const data = [];
        let price = 45000;
        
        for (let i = 0; i < count; i++) {
            const open = price;
            const change = (Math.random() - 0.5) * 0.03;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.015);
            const low = Math.min(open, close) * (1 - Math.random() * 0.015);
            
            data.push({
                x: i,
                o: open,
                h: high,
                l: low,
                c: close
            });
            
            price = close;
        }
        
        return data;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tradersDojo = new TradersDojo();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border-left: 4px solid;
            border-radius: 10px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification.info {
            border-left-color: #3b82f6;
        }
        
        .notification.success {
            border-left-color: #10b981;
        }
        
        .notification.warning {
            border-left-color: #f59e0b;
        }
        
        .notification.error {
            border-left-color: #ef4444;
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification.info i {
            color: #3b82f6;
        }
        
        .notification.success i {
            color: #10b981;
        }
        
        .notification.warning i {
            color: #f59e0b;
        }
        
        .notification.error i {
            color: #ef4444;
        }
        
        .trade-result-notification {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(-100px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            border: 2px solid;
        }
        
        .trade-result-notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .trade-result-notification.win {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
        }
        
        .trade-result-notification.loss {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
        
        .result-icon i {
            font-size: 32px;
        }
        
        .trade-result-notification.win .result-icon i {
            color: #10b981;
        }
        
        .trade-result-notification.loss .result-icon i {
            color: #ef4444;
        }
        
        .result-details h4 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .result-details p {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .result-details small {
            color: #94a3b8;
            font-size: 12px;
        }
        
        .level-up-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(30px);
            border-radius: 20px;
            padding: 40px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center;
            border: 2px solid #3b82f6;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 100px rgba(59, 130, 246, 0.3);
        }
        
        .level-up-notification.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .level-up-content i {
            font-size: 60px;
            color: #f59e0b;
            margin-bottom: 20px;
            animation: pulse 1s infinite;
        }
        
        .level-up-content h2 {
            font-size: 36px;
            font-weight: 800;
            background: linear-gradient(90deg, #f59e0b, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .level-up-content p {
            font-size: 20px;
            margin-bottom: 10px;
            color: white;
        }
        
        .level-up-content small {
            color: #94a3b8;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});
