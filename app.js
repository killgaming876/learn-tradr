// TradeDojo Pro - Smooth Trading Learning Platform

class TradeDojo {
    constructor() {
        this.state = {
            user: {
                name: "Trader",
                level: 1,
                xp: 0,
                xpNeeded: 100,
                balance: 10000,
                trades: 0,
                wins: 0,
                losses: 0,
                winStreak: 0,
                profit: 0,
                lessonsCompleted: 0,
                totalLessons: 10,
                signalsUnlocked: 1,
                trainingTime: 0
            },
            currentLesson: 1,
            currentTrade: null,
            aiMessages: [],
            chartData: null,
            lessons: this.createLessons(),
            signals: this.createSignals(),
            achievements: this.createAchievements()
        };
        
        this.init();
    }
    
    init() {
        this.loadState();
        this.setupUI();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAI();
        this.updateUI();
        this.startTrainingTimer();
    }
    
    createLessons() {
        return [
            {
                id: 1,
                title: "Candlestick Basics",
                description: "Learn to read price action through candles",
                duration: 15,
                xp: 10,
                completed: false,
                content: "Candlesticks show opening, closing, high, and low prices. Green/white candles close higher than they open. Red/black candles close lower."
            },
            {
                id: 2,
                title: "Support & Resistance",
                description: "Identify key price levels",
                duration: 20,
                xp: 10,
                completed: false,
                content: "Support is where price tends to bounce up. Resistance is where price tends to bounce down."
            },
            {
                id: 3,
                title: "Trend Analysis",
                description: "Spot market directions",
                duration: 18,
                xp: 10,
                completed: false,
                content: "Uptrend: Higher highs and higher lows. Downtrend: Lower highs and lower lows."
            },
            {
                id: 4,
                title: "Moving Averages",
                description: "Use MA for trend confirmation",
                duration: 22,
                xp: 10,
                completed: false,
                content: "Moving averages smooth price data to identify trends. Golden cross (bullish) and death cross (bearish)."
            },
            {
                id: 5,
                title: "RSI Indicator",
                description: "Measure overbought/oversold",
                duration: 25,
                xp: 10,
                completed: false,
                content: "RSI ranges 0-100. Below 30 = oversold, above 70 = overbought."
            },
            {
                id: 6,
                title: "MACD Strategy",
                description: "Trend-following momentum",
                duration: 28,
                xp: 10,
                completed: false,
                content: "MACD line crossing signal line indicates potential trend changes."
            },
            {
                id: 7,
                title: "Fibonacci Retracement",
                description: "Find reversal levels",
                duration: 30,
                xp: 10,
                completed: false,
                content: "Key levels: 23.6%, 38.2%, 50%, 61.8%, 78.6%"
            },
            {
                id: 8,
                title: "Risk Management",
                description: "Protect your capital",
                duration: 25,
                xp: 10,
                completed: false,
                content: "Never risk more than 2% per trade. Use stop losses always."
            },
            {
                id: 9,
                title: "Position Sizing",
                description: "Calculate optimal trade size",
                duration: 20,
                xp: 10,
                completed: false,
                content: "Position size = (Account risk %) / (Stop loss %)"
            },
            {
                id: 10,
                title: "Trading Psychology",
                description: "Master your emotions",
                duration: 35,
                xp: 10,
                completed: false,
                content: "Trading is 80% psychology, 20% strategy. Keep emotions in check."
            }
        ];
    }
    
    createSignals() {
        return [
            { id: 1, name: "RSI Oversold", level: 1, unlocked: true, accuracy: 85 },
            { id: 2, name: "MACD Bullish", level: 2, unlocked: false, accuracy: 78 },
            { id: 3, name: "Support Bounce", level: 3, unlocked: false, accuracy: 82 },
            { id: 4, name: "Trend Reversal", level: 4, unlocked: false, accuracy: 75 },
            { id: 5, name: "Breakout", level: 5, unlocked: false, accuracy: 80 },
            { id: 6, name: "Volume Spike", level: 6, unlocked: false, accuracy: 77 },
            { id: 7, name: "Divergence", level: 7, unlocked: false, accuracy: 73 },
            { id: 8, name: "Pattern Recognition", level: 8, unlocked: false, accuracy: 81 },
            { id: 9, name: "Multi-timeframe", level: 9, unlocked: false, accuracy: 79 },
            { id: 10, name: "AI Composite", level: 10, unlocked: false, accuracy: 88 }
        ];
    }
    
    createAchievements() {
        return [
            { id: 1, name: "First Steps", description: "Complete first lesson", unlocked: false },
            { id: 2, name: "Quick Learner", description: "Complete 3 lessons", unlocked: false },
            { id: 3, name: "Trend Spotter", description: "Identify 5 trends correctly", unlocked: false },
            { id: 4, name: "Risk Manager", description: "Maintain 80% win rate for 10 trades", unlocked: false },
            { id: 5, name: "Master Analyst", description: "Complete all lessons", unlocked: false },
            { id: 6, name: "Profit Maker", description: "Make $1000 profit", unlocked: false },
            { id: 7, name: "Win Streak", description: "5 consecutive wins", unlocked: false },
            { id: 8, name: "Signal Pro", description: "Unlock 5 signals", unlocked: false }
        ];
    }
    
    loadState() {
        const saved = localStorage.getItem('tradeDojoState');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.user = { ...this.state.user, ...data.user };
            this.state.lessons = data.lessons || this.state.lessons;
            this.state.currentLesson = data.currentLesson || 1;
        }
    }
    
    saveState() {
        localStorage.setItem('tradeDojoState', JSON.stringify({
            user: this.state.user,
            lessons: this.state.lessons,
            currentLesson: this.state.currentLesson
        }));
    }
    
    setupUI() {
        // Update all UI elements
        this.updateUI();
        
        // Initialize lesson UI
        this.updateLessonUI();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item.dataset.section);
                this.createClickEffect(e);
            });
        });
        
        // Lesson navigation
        document.getElementById('nextLesson')?.addEventListener('click', () => this.nextLesson());
        document.getElementById('prevLesson')?.addEventListener('click', () => this.prevLesson());
        
        // Trading buttons
        document.getElementById('buyBtn')?.addEventListener('click', () => this.selectTrade('buy'));
        document.getElementById('sellBtn')?.addEventListener('click', () => this.selectTrade('sell'));
        document.getElementById('executeBtn')?.addEventListener('click', () => this.executeTrade());
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeTrade());
        
        // Position slider
        const slider = document.getElementById('positionSlider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                document.getElementById('positionValue').textContent = value.toLocaleString();
                const risk = ((value / this.state.user.balance) * 100).toFixed(1);
                document.getElementById('riskPercent').textContent = risk + '%';
            });
        }
        
        // AI chat
        document.getElementById('sendAiMessage')?.addEventListener('click', () => this.sendAIMessage());
        document.getElementById('aiInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAIMessage();
        });
        
        // Chart controls
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartTimeframe(e.target.dataset.tf);
            });
        });
        
        // Level up modal
        document.getElementById('closeLevelUp')?.addEventListener('click', () => {
            document.getElementById('levelUpModal').classList.remove('show');
        });
        
        // Lesson items
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('locked')) {
                    const lessonId = parseInt(item.dataset.lesson);
                    this.openLesson(lessonId);
                    this.createClickEffect(e);
                }
            });
        });
    }
    
    handleNavigation(section) {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Show section with animation
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.animation = 'fadeIn 0.5s ease-out';
            
            // Update today's progress
            if (section === 'lessons') {
                this.updateTodayProgress();
            }
        }
    }
    
    updateUI() {
        const u = this.state.user;
        
        // Update header stats
        document.getElementById('displayBalance').textContent = `$${u.balance.toLocaleString()}`;
        document.getElementById('winStreak').textContent = u.winStreak;
        document.getElementById('currentXP').textContent = u.xp;
        document.getElementById('currentLevel').textContent = u.level;
        document.getElementById('userLevel').textContent = u.level;
        
        // Update XP bar
        const xpPercent = (u.xp / u.xpNeeded) * 100;
        document.getElementById('xpFillBar').style.width = `${xpPercent}%`;
        
        // Update dashboard stats
        document.getElementById('totalLessons').textContent = `${u.lessonsCompleted}/${u.totalLessons}`;
        document.getElementById('totalTrades').textContent = u.trades;
        document.getElementById('accuracyRate').textContent = u.trades > 0 
            ? `${Math.round((u.wins / u.trades) * 100)}%` 
            : '0%';
        document.getElementById('trainingTime').textContent = `${u.trainingTime}h`;
        
        // Update practice balance
        document.getElementById('practiceBalance').textContent = `$${u.balance.toLocaleString()}`;
        
        // Update signals
        document.getElementById('unlockedSignals').textContent = `${u.signalsUnlocked}/10`;
        
        // Update badges
        document.getElementById('lessonsBadge').textContent = u.totalLessons - u.lessonsCompleted;
        document.getElementById('signalsBadge').textContent = u.signalsUnlocked;
    }
    
    updateLessonUI() {
        const lessons = this.state.lessons;
        
        // Update lesson items
        lessons.forEach(lesson => {
            const item = document.querySelector(`.lesson-item[data-lesson="${lesson.id}"]`);
            if (item) {
                if (lesson.completed) {
                    item.classList.add('completed');
                    item.classList.remove('active', 'locked');
                } else if (lesson.id === this.state.currentLesson) {
                    item.classList.add('active');
                    item.classList.remove('completed', 'locked');
                } else if (lesson.id > this.state.currentLesson) {
                    item.classList.add('locked');
                    item.classList.remove('active', 'completed');
                }
            }
        });
        
        // Update today's progress
        this.updateTodayProgress();
    }
    
    updateTodayProgress() {
        const todayLessons = this.state.lessons.filter(l => 
            !l.completed && l.id <= this.state.currentLesson
        ).length;
        document.getElementById('todayProgress').textContent = `${todayLessons}/3`;
    }
    
    openLesson(lessonId) {
        this.state.currentLesson = lessonId;
        this.handleNavigation('lessons');
        
        // Update lesson detail
        const lesson = this.state.lessons.find(l => l.id === lessonId);
        if (lesson) {
            const detail = document.querySelector(`.lesson-detail[data-lesson="${lessonId}"]`);
            if (detail) {
                document.querySelectorAll('.lesson-detail').forEach(d => d.classList.remove('active'));
                detail.classList.add('active');
                detail.querySelector('.lesson-content').innerHTML = `
                    <p>${lesson.content}</p>
                    <div style="background: var(--bg-lighter); padding: 25px; border-radius: var(--radius); margin: 25px 0;">
                        <h4 style="margin-bottom: 15px; color: var(--primary);">Key Takeaways:</h4>
                        <ul style="list-style: none; padding-left: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                                <i class="fas fa-check-circle" style="color: var(--success); margin-right: 10px;"></i>
                                This concept is fundamental to technical analysis
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                                <i class="fas fa-check-circle" style="color: var(--success); margin-right: 10px;"></i>
                                Practice identifying this on the charts
                            </li>
                            <li style="padding: 8px 0;">
                                <i class="fas fa-check-circle" style="color: var(--success); margin-right: 10px;"></i>
                                Complete the practice exercise to earn 10 XP
                            </li>
                        </ul>
                    </div>
                    <button class="btn-action primary" id="completeLessonBtn" style="margin-top: 20px;">
                        <i class="fas fa-check"></i> Complete Lesson (10 XP)
                    </button>
                `;
                
                // Add complete button listener
                document.getElementById('completeLessonBtn')?.addEventListener('click', () => {
                    this.completeLesson(lessonId);
                });
            }
        }
    }
    
    completeLesson(lessonId) {
        const lesson = this.state.lessons.find(l => l.id === lessonId);
        if (lesson && !lesson.completed) {
            // Mark as completed
            lesson.completed = true;
            
            // Add XP
            this.addXP(lesson.xp);
            
            // Update user stats
            this.state.user.lessonsCompleted++;
            
            // Show completion effect
            this.showCompletionEffect(lesson.title);
            
            // Add AI message
            this.addAIMessage(`Great job completing "${lesson.title}"! You've earned ${lesson.xp} XP.`);
            
            // Unlock next lesson if available
            if (lessonId < this.state.lessons.length) {
                this.state.currentLesson = lessonId + 1;
            }
            
            // Save and update UI
            this.saveState();
            this.updateUI();
            this.updateLessonUI();
            
            // Check for achievements
            this.checkAchievements();
        }
    }
    
    addXP(amount) {
        const oldLevel = this.state.user.level;
        this.state.user.xp += amount;
        
        // Check level up
        while (this.state.user.xp >= this.state.user.xpNeeded) {
            this.state.user.xp -= this.state.user.xpNeeded;
            this.state.user.level++;
            this.state.user.xpNeeded = Math.round(this.state.user.xpNeeded * 1.2);
            
            // Unlock new signal
            this.state.user.signalsUnlocked++;
            
            // Show level up modal
            this.showLevelUp();
        }
        
        // Update UI
        this.updateUI();
        
        // Save state
        this.saveState();
    }
    
    showLevelUp() {
        document.getElementById('newLevel').textContent = this.state.user.level;
        document.getElementById('levelUpModal').classList.add('show');
        
        // Create confetti effect
        this.createConfetti();
    }
    
    selectTrade(direction) {
        // Visual feedback
        document.querySelectorAll('.btn-trade').forEach(btn => {
            btn.style.transform = 'scale(1)';
        });
        
        const selectedBtn = document.getElementById(direction === 'buy' ? 'buyBtn' : 'sellBtn');
        selectedBtn.style.transform = 'scale(1.05)';
        
        // Store selection
        this.state.currentTrade = { direction };
        
        // Enable execute button
        document.getElementById('executeBtn').disabled = false;
        
        // Add AI analysis
        this.addAIMessage(`You selected ${direction.toUpperCase()}. Good choice! Let me analyze this setup...`);
        setTimeout(() => {
            const analysis = direction === 'buy' 
                ? "I'm seeing bullish momentum on the 15-minute chart. RSI is recovering from oversold conditions."
                : "Bearish pressure is building. Price is struggling to break above resistance with decreasing volume.";
            this.addAIMessage(analysis);
        }, 1000);
    }
    
    executeTrade() {
        if (!this.state.currentTrade) return;
        
        const position = parseInt(document.getElementById('positionValue').textContent.replace(/,/g, ''));
        const direction = this.state.currentTrade.direction;
        
        // Simulate trade outcome (65% win rate for demo)
        const isWin = Math.random() < 0.65;
        const profitMultiplier = isWin ? 0.08 : -0.05;
        const profit = Math.round(position * profitMultiplier);
        
        // Update user stats
        this.state.user.balance += profit;
        this.state.user.trades++;
        
        if (isWin) {
            this.state.user.wins++;
            this.state.user.winStreak++;
            this.state.user.profit += profit;
        } else {
            this.state.user.losses++;
            this.state.user.winStreak = 0;
        }
        
        // Show result
        this.showTradeResult(direction, isWin, profit);
        
        // Add XP for trading
        this.addXP(5);
        
        // Update UI
        this.updateUI();
        this.saveState();
        
        // Reset selection
        this.state.currentTrade = null;
        document.querySelectorAll('.btn-trade').forEach(btn => {
            btn.style.transform = 'scale(1)';
        });
        document.getElementById('executeBtn').disabled = true;
    }
    
    showTradeResult(direction, isWin, profit) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${isWin ? 'success' : 'error'}`;
        toast.innerHTML = `
            <i class="fas ${isWin ? 'fa-trophy' : 'fa-exclamation-triangle'}"></i>
            <div>
                <h4>${isWin ? 'Trade Won!' : 'Trade Lost'}</h4>
                <p>${direction.toUpperCase()} • ${profit > 0 ? '+' : ''}$${Math.abs(profit)}</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show with animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // Add AI feedback
        setTimeout(() => {
            const feedback = isWin 
                ? `Excellent trade! You made $${profit} profit. Your analysis was correct!`
                : `The market went against us this time. We lost $${Math.abs(profit)}. Let's review what happened.`;
            this.addAIMessage(feedback);
        }, 500);
    }
    
    analyzeTrade() {
        if (!this.state.currentTrade) {
            this.addAIMessage("Please select BUY or SELL first, then I'll analyze the setup for you.");
            return;
        }
        
        const analysis = this.state.currentTrade.direction === 'buy'
            ? "Analysis: Price is above the 50-period moving average. RSI shows bullish momentum. Volume is increasing on up moves. Support is holding strong at $44,500. I give this a 72% probability of success."
            : "Analysis: Price is struggling below resistance. Bearish divergence on RSI. Volume is decreasing on up moves. Next support at $43,800. I give this a 68% probability of success.";
        
        this.addAIMessage(analysis);
    }
    
    sendAIMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addAIMessage(message, 'user');
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response);
        }, 800);
    }
    
    addAIMessage(message, sender = 'ai') {
        const chat = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
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
        const responses = [
            "Great question! In trading, patience is key. Wait for the setup to develop completely.",
            "Based on current market conditions, I'd recommend focusing on risk management first.",
            "That's an interesting point! Have you considered checking multiple timeframes for confirmation?",
            "Remember: 'Cut your losses short and let your profits run.' This is the golden rule of trading.",
            "I see you're thinking about market direction. Always trade with the trend when possible.",
            "Your analysis is improving! Keep practicing and you'll master this in no time.",
            "Let me break that down with a simple analogy that might help clarify things...",
            "Based on the chart patterns I'm seeing, here's what I would watch for..."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    startAI() {
        // Initial AI messages
        setTimeout(() => {
            this.addAIMessage("Welcome to TradeDojo Pro! I'm Sensei Kuro, your AI trading mentor.");
        }, 1000);
        
        setTimeout(() => {
            this.addAIMessage("I'll guide you through 10 comprehensive lessons, each giving you 10 XP.");
        }, 3000);
        
        setTimeout(() => {
            this.addAIMessage("Complete lessons to level up and unlock new trading signals!");
        }, 5000);
    }
    
    nextLesson() {
        if (this.state.currentLesson < this.state.lessons.length) {
            this.state.currentLesson++;
            this.openLesson(this.state.currentLesson);
        }
    }
    
    prevLesson() {
        if (this.state.currentLesson > 1) {
            this.state.currentLesson--;
            this.openLesson(this.state.currentLesson);
        }
    }
    
    updateChartTimeframe(timeframe) {
        // In a real app, this would update the chart data
        this.addAIMessage(`Switched to ${timeframe} timeframe. Analyzing market structure...`);
    }
    
    initializeCharts() {
        // Initialize practice chart
        const ctx = document.getElementById('practiceChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 50}, (_, i) => `C${i+1}`),
                    datasets: [{
                        label: 'BTC/USD',
                        data: this.generateRandomData(50, 45000, 46000),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
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
        
        // Initialize live chart
        const liveCtx = document.getElementById('liveChart')?.getContext('2d');
        if (liveCtx) {
            new Chart(liveCtx, {
                type: 'candlestick',
                data: {
                    datasets: [{
                        label: 'BTC/USD',
                        data: this.generateCandleData(30),
                        color: {
                            up: '#10b981',
                            down: '#ef4444'
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }
    
    generateRandomData(count, min, max) {
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
    
    generateCandleData(count) {
        const data = [];
        let price = 45000;
        
        for (let i = 0; i < count; i++) {
            const open = price;
            const change = (Math.random() - 0.5) * 0.03;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.015);
            const low = Math.min(open, close) * (1 - Math.random() * 0.015);
            
            data.push({ x: i, o: open, h: high, l: low, c: close });
            price = close;
        }
        
        return data;
    }
    
    startTrainingTimer() {
        // Update training time every minute
        setInterval(() => {
            this.state.user.trainingTime++;
            this.updateUI();
            this.saveState();
        }, 60000);
    }
    
    showCompletionEffect(lessonTitle) {
        // Create celebration particles
        this.createCelebrationParticles();
        
        // Show toast
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Lesson Completed!</h4>
                <p>${lessonTitle} • +10 XP</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            pointer-events: none;
            z-index: 1000;
            left: ${event.clientX - 10}px;
            top: ${event.clientY - 10}px;
            transform: scale(0);
        `;
        document.body.appendChild(effect);
        
        effect.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => effect.remove(), 600);
    }
    
    createConfetti() {
        const container = document.getElementById('particlesOverlay');
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 2001;
            `;
            container.appendChild(confetti);
            
            const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.3;
            const distance = Math.random() * 300 + 200;
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 400}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
            ], {
                duration: 1200,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            setTimeout(() => confetti.remove(), 1200);
        }
    }
    
    createCelebrationParticles() {
        const container = document.getElementById('particlesOverlay');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: #10b981;
                left: 50%;
                top: 50%;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            container.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 100;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            setTimeout(() => particle.remove(), 800);
        }
    }
    
    checkAchievements() {
        const u = this.state.user;
        const achievements = this.state.achievements;
        
        // Check first steps
        if (u.lessonsCompleted >= 1 && !achievements[0].unlocked) {
            achievements[0].unlocked = true;
            this.showAchievement(achievements[0]);
        }
        
        // Check quick learner
        if (u.lessonsCompleted >= 3 && !achievements[1].unlocked) {
            achievements[1].unlocked = true;
            this.showAchievement(achievements[1]);
        }
        
        // Check profit maker
        if (u.profit >= 1000 && !achievements[5].unlocked) {
            achievements[5].unlocked = true;
            this.showAchievement(achievements[5]);
        }
        
        // Check win streak
        if (u.winStreak >= 5 && !achievements[6].unlocked) {
            achievements[6].unlocked = true;
            this.showAchievement(achievements[6]);
        }
        
        // Check signal pro
        if (u.signalsUnlocked >= 5 && !achievements[7].unlocked) {
            achievements[7].unlocked = true;
            this.showAchievement(achievements[7]);
        }
    }
    
    showAchievement(achievement) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <i class="fas fa-trophy"></i>
            <div>
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.name}</p>
                <small>${achievement.description}</small>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
        
        // Add AI message
        this.addAIMessage(`Congratulations! You unlocked the "${achievement.name}" achievement!`);
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new TradeDojo();
    });
} else {
    window.app = new TradeDojo();
}
