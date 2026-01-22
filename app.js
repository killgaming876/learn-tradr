// TradeDojo Pro - Main Application Logic

class TradingPlatform {
    constructor() {
        this.state = {
            user: {
                name: "Trader",
                balance: 10000,
                trades: 0,
                wins: 0,
                losses: 0,
                winStreak: 0,
                profit: 0,
                totalTrades: 0,
                monthlyProfit: 11,
                monthlyTrades: 3,
                winningTrades: 2,
                losingTrades: 1
            },
            currentTrade: null,
            tradeHistory: [],
            alerts: [],
            positionSize: 500,
            riskPercent: 5,
            selectedAsset: 'BTC/USD',
            selectedTimeframe: '1h'
        };
        
        this.init();
    }
    
    init() {
        this.loadState();
        this.setupUI();
        this.setupEventListeners();
        this.updateUI();
        this.loadTradeHistory();
        this.startBackgroundUpdates();
    }
    
    loadState() {
        const saved = localStorage.getItem('tradeDojoState');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.user = { ...this.state.user, ...data.user };
            this.state.tradeHistory = data.tradeHistory || [];
            this.state.alerts = data.alerts || [];
            this.state.positionSize = data.positionSize || 500;
            this.state.riskPercent = data.riskPercent || 5;
        }
    }
    
    saveState() {
        localStorage.setItem('tradeDojoState', JSON.stringify({
            user: this.state.user,
            tradeHistory: this.state.tradeHistory,
            alerts: this.state.alerts,
            positionSize: this.state.positionSize,
            riskPercent: this.state.riskPercent
        }));
    }
    
    setupUI() {
        // Update all UI elements
        this.updateUI();
        
        // Initialize position slider
        this.updatePositionSlider();
        
        // Initialize session timer
        this.updateSessionTimer();
    }
    
    setupEventListeners() {
        // Trade buttons
        document.getElementById('buyBtn').addEventListener('click', () => this.selectTrade('buy'));
        document.getElementById('sellBtn').addEventListener('click', () => this.selectTrade('sell'));
        
        // Position slider
        document.getElementById('positionSlider').addEventListener('input', (e) => {
            this.updatePositionSize(parseInt(e.target.value));
        });
        
        // Action buttons
        document.getElementById('analyzeSetupBtn').addEventListener('click', () => this.analyzeSetup());
        document.getElementById('viewDetailsBtn').addEventListener('click', () => this.showTradeDetails());
        
        // Modal buttons
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('confirmTrade').addEventListener('click', () => this.executeTrade());
        document.getElementById('setAlertBtn').addEventListener('click', () => this.setPriceAlert());
        
        // Alert buttons
        document.getElementById('addAlertBtn').addEventListener('click', () => this.showAlertForm());
        document.getElementById('saveAlertBtn').addEventListener('click', () => this.saveAlert());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'b' && e.ctrlKey) {
                e.preventDefault();
                this.selectTrade('buy');
            }
            if (e.key === 's' && e.ctrlKey) {
                e.preventDefault();
                this.selectTrade('sell');
            }
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                if (this.state.currentTrade) {
                    this.showTradeDetails();
                }
            }
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    updateUI() {
        const u = this.state.user;
        
        // Update header
        document.getElementById('currentBalance').textContent = `$${u.balance.toLocaleString()}`;
        document.getElementById('winRate').textContent = u.totalTrades > 0 ? 
            `${Math.round((u.wins / u.totalTrades) * 100)}%` : '0%';
        document.getElementById('totalTrades').textContent = u.totalTrades;
        
        // Update trading panel
        document.getElementById('tradingBalance').textContent = `$${u.balance.toLocaleString()}`;
        
        // Update history stats
        document.getElementById('winCount').textContent = u.wins;
        document.getElementById('lossCount').textContent = u.losses;
        
        // Update monthly performance
        document.getElementById('monthlyProfit').textContent = `${u.monthlyProfit}%`;
        document.getElementById('monthlyTrades').textContent = u.monthlyTrades;
        document.getElementById('winningTrades').textContent = u.winningTrades;
        document.getElementById('losingTrades').textContent = u.losingTrades;
        
        // Update position values
        document.getElementById('positionValue').textContent = this.state.positionSize.toLocaleString();
        document.getElementById('riskPercent').textContent = `${this.state.riskPercent}%`;
        
        // Update trade history list
        this.updateTradeHistory();
    }
    
    updatePositionSlider() {
        const slider = document.getElementById('positionSlider');
        slider.value = this.state.positionSize;
        
        // Update risk percentage
        this.state.riskPercent = ((this.state.positionSize / this.state.user.balance) * 100).toFixed(1);
    }
    
    updatePositionSize(value) {
        this.state.positionSize = value;
        this.state.riskPercent = ((value / this.state.user.balance) * 100).toFixed(1);
        
        document.getElementById('positionValue').textContent = value.toLocaleString();
        document.getElementById('riskPercent').textContent = `${this.state.riskPercent}%`;
    }
    
    selectTrade(direction) {
        // Reset button states
        document.querySelectorAll('.btn-trade').forEach(btn => {
            btn.style.transform = 'scale(1)';
        });
        
        // Highlight selected button
        const selectedBtn = direction === 'buy' ? 
            document.getElementById('buyBtn') : 
            document.getElementById('sellBtn');
        selectedBtn.style.transform = 'scale(1.05)';
        
        // Store trade selection
        this.state.currentTrade = {
            direction: direction,
            asset: this.state.selectedAsset,
            positionSize: this.state.positionSize,
            riskPercent: this.state.riskPercent,
            timestamp: new Date()
        };
        
        // Show analysis
        this.analyzeTrade();
        
        // Show toast
        this.showToast(`${direction.toUpperCase()} selected. Analyzing setup...`, 'info');
    }
    
    analyzeTrade() {
        if (!this.state.currentTrade) return;
        
        // Simulate analysis
        const direction = this.state.currentTrade.direction;
        const isBullish = direction === 'buy';
        
        setTimeout(() => {
            const analysis = isBullish ? 
                "✅ Bullish setup detected. Trend line has been touched twice, awaiting 3rd touch for entry." :
                "✅ Bearish setup detected. Price is respecting resistance trend line.";
            
            this.showToast(analysis, 'success');
            
            // Update setup details
            document.getElementById('setupStatus').textContent = 'SETUP VALID';
            document.getElementById('setupStatus').style.background = 'var(--success)';
        }, 1000);
    }
    
    analyzeSetup() {
        // Check if we're in London session
        const now = new Date();
        const gmtHours = now.getUTCHours();
        const isLondonSession = gmtHours >= 8 && gmtHours < 17;
        
        if (!isLondonSession) {
            this.showToast('❌ Outside London Session. Wait for 8 AM - 5 PM GMT.', 'warning');
            return;
        }
        
        // Check trend line touches
        const touches = window.chart?.touchCounts || {};
        const hasValidSetup = Object.values(touches).some(count => count >= 2);
        
        if (!hasValidSetup) {
            this.showToast('No valid trend line setup detected. Need at least 2 touches.', 'warning');
            return;
        }
        
        // All checks passed
        const analysis = `
            ✅ London Session Active
            ✅ Trend Line Valid (2+ touches)
            ✅ Break of Structure Confirmed
            ✅ 1H Timeframe Valid
            🎯 Ready for 3rd Touch Entry
        `;
        
        this.showToast('Setup Analysis Complete', 'success');
        
        // Show detailed analysis
        document.getElementById('setupStatus').textContent = 'READY FOR ENTRY';
        document.getElementById('setupStatus').style.background = 'var(--success)';
    }
    
    showTradeDetails() {
        if (!this.state.currentTrade) {
            this.showToast('Please select BUY or SELL first', 'warning');
            return;
        }
        
        const trade = this.state.currentTrade;
        const direction = trade.direction;
        const isBullish = direction === 'buy';
        
        // Get current price from chart
        const currentPrice = window.chart?.candleData?.slice(-1)[0]?.c || 45320.50;
        
        // Calculate trade levels based on strategy rules
        const stopLossDistance = currentPrice * 0.01; // 1% stop loss
        const takeProfit1 = isBullish ? 
            currentPrice + (stopLossDistance * 2) : // 1:2 RR
            currentPrice - (stopLossDistance * 2);
        const takeProfit2 = isBullish ?
            currentPrice + (stopLossDistance * 3) : // 1:3 RR
            currentPrice - (stopLossDistance * 3);
        
        // Calculate potential profit/loss
        const potentialLoss = (trade.positionSize * (stopLossDistance / currentPrice)).toFixed(2);
        const potentialProfit = (trade.positionSize * (stopLossDistance * 3 / currentPrice)).toFixed(2);
        
        // Update modal content
        document.getElementById('modalAsset').textContent = trade.asset;
        document.getElementById('modalDirection').textContent = direction.toUpperCase();
        document.getElementById('modalEntry').textContent = `$${currentPrice.toFixed(2)}`;
        document.getElementById('modalSL').textContent = `$${(isBullish ? currentPrice - stopLossDistance : currentPrice + stopLossDistance).toFixed(2)}`;
        document.getElementById('modalTP1').textContent = `$${takeProfit1.toFixed(2)} (1:2)`;
        document.getElementById('modalTP2').textContent = `$${takeProfit2.toFixed(2)} (1:3)`;
        document.getElementById('modalSize').textContent = `$${trade.positionSize.toLocaleString()} (${trade.riskPercent}%)`;
        document.getElementById('modalProfit').textContent = `$${potentialProfit} (${((potentialProfit / trade.positionSize) * 100).toFixed(1)}%)`;
        document.getElementById('modalLoss').textContent = `$${potentialLoss} (${((potentialLoss / trade.positionSize) * 100).toFixed(1)}%)`;
        
        // Show modal
        document.getElementById('setupModal').classList.add('show');
    }
    
    executeTrade() {
        if (!this.state.currentTrade) return;
        
        const trade = this.state.currentTrade;
        const isBuy = trade.direction === 'buy';
        
        // Simulate trade outcome (70% win rate for demo)
        const isWin = Math.random() < 0.70;
        const profitMultiplier = isWin ? 0.03 : -0.01; // 3% win, 1% loss
        const profit = trade.positionSize * profitMultiplier;
        
        // Update user stats
        this.state.user.balance += profit;
        this.state.user.totalTrades++;
        this.state.user.profit += profit;
        
        if (isWin) {
            this.state.user.wins++;
            this.state.user.winStreak++;
        } else {
            this.state.user.losses++;
            this.state.user.winStreak = 0;
        }
        
        // Update monthly stats (simplified)
        this.state.user.monthlyTrades++;
        if (isWin) {
            this.state.user.winningTrades++;
        } else {
            this.state.user.losingTrades++;
        }
        this.state.user.monthlyProfit = ((this.state.user.profit / 10000) * 100).toFixed(1);
        
        // Create trade record
        const tradeRecord = {
            id: Date.now(),
            asset: trade.asset,
            direction: trade.direction,
            entry: window.chart?.candleData?.slice(-1)[0]?.c || 45320.50,
            exit: (window.chart?.candleData?.slice(-1)[0]?.c || 45320.50) * (1 + profitMultiplier),
            size: trade.positionSize,
            profit: profit,
            isWin: isWin,
            timestamp: new Date()
        };
        
        // Add to history
        this.state.tradeHistory.unshift(tradeRecord);
        
        // Show result
        this.showTradeResult(tradeRecord);
        
        // Update UI
        this.updateUI();
        this.saveState();
        
        // Close modal
        this.closeModal();
        
        // Reset current trade
        this.state.currentTrade = null;
        document.querySelectorAll('.btn-trade').forEach(btn => {
            btn.style.transform = 'scale(1)';
        });
    }
    
    showTradeResult(trade) {
        const isWin = trade.isWin;
        const profit = trade.profit;
        
        // Create result notification
        const message = isWin ? 
            `🎉 Trade Won! Profit: $${Math.abs(profit).toFixed(2)}` :
            `📉 Trade Lost. Loss: $${Math.abs(profit).toFixed(2)}`;
        
        this.showToast(message, isWin ? 'success' : 'error');
        
        // Add strategy reminder
        setTimeout(() => {
            const reminder = isWin ? 
                "Remember: Book 50-60% at 1:2, trail stop loss" :
                "Remember: No new trades until trendline breaks & pullback";
            this.showToast(reminder, 'info');
        }, 2000);
    }
    
    setPriceAlert() {
        if (!this.state.currentTrade) return;
        
        const currentPrice = window.chart?.candleData?.slice(-1)[0]?.c || 45320.50;
        const alertPrice = this.state.currentTrade.direction === 'buy' ?
            currentPrice * 1.02 : // 2% above for buy
            currentPrice * 0.98;  // 2% below for sell
        
        const alert = {
            id: Date.now(),
            asset: this.state.selectedAsset,
            price: alertPrice,
            type: this.state.currentTrade.direction,
            active: true,
            created: new Date()
        };
        
        this.state.alerts.push(alert);
        this.saveState();
        
        this.showToast(`Alert set at $${alertPrice.toFixed(2)}`, 'success');
        this.updateAlertsList();
    }
    
    showAlertForm() {
        const alertForm = document.getElementById('alertForm');
        alertForm.style.display = alertForm.style.display === 'none' ? 'block' : 'none';
    }
    
    saveAlert() {
        const alertPrice = parseFloat(document.getElementById('alertPrice').value);
        
        if (!alertPrice || alertPrice <= 0) {
            this.showToast('Please enter a valid price', 'error');
            return;
        }
        
        const alert = {
            id: Date.now(),
            asset: this.state.selectedAsset,
            price: alertPrice,
            type: 'custom',
            active: true,
            created: new Date()
        };
        
        this.state.alerts.push(alert);
        this.saveState();
        
        // Clear input and hide form
        document.getElementById('alertPrice').value = '';
        document.getElementById('alertForm').style.display = 'none';
        
        this.showToast('Price alert saved', 'success');
        this.updateAlertsList();
    }
    
    updateAlertsList() {
        const alertList = document.getElementById('alertList');
        alertList.innerHTML = '';
        
        this.state.alerts.slice(0, 5).forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <div style="font-weight: 600; color: var(--text-white); margin-bottom: 5px;">
                    ${alert.asset} ${alert.type === 'buy' ? '>' : '<'} $${alert.price.toFixed(2)}
                </div>
                <div style="font-size: 12px; color: var(--text-gray);">
                    ${alert.type === 'custom' ? 'Custom Alert' : 'Trade Alert'} • 
                    ${new Date(alert.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            `;
            alertList.appendChild(alertItem);
        });
    }
    
    loadTradeHistory() {
        // Load sample trades for demo
        if (this.state.tradeHistory.length === 0) {
            this.state.tradeHistory = [
                {
                    id: 1,
                    asset: 'BTC/USD',
                    direction: 'buy',
                    entry: 44250.00,
                    exit: 45680.50,
                    size: 500,
                    profit: 1430.50,
                    isWin: true,
                    timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
                },
                {
                    id: 2,
                    asset: 'ETH/USD',
                    direction: 'sell',
                    entry: 2520.00,
                    exit: 2450.75,
                    size: 300,
                    profit: 69.25,
                    isWin: true,
                    timestamp: new Date(Date.now() - 86400000 * 1) // 1 day ago
                }
            ];
        }
        
        this.updateTradeHistory();
    }
    
    updateTradeHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.state.tradeHistory.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history" style="text-align: center; color: var(--text-gray); padding: 40px;">
                    <i class="fas fa-history" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                    <p>No trades yet. Execute your first trade!</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        this.state.tradeHistory.slice(0, 5).forEach(trade => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${trade.isWin ? 'win' : 'loss'}`;
            historyItem.innerHTML = `
                <div class="trade-info">
                    <div class="trade-pair">${trade.asset} • ${trade.direction.toUpperCase()}</div>
                    <div class="trade-details">
                        <span>Entry: $${trade.entry.toFixed(2)}</span>
                        <span>Size: $${trade.size}</span>
                        <span>${new Date(trade.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="trade-result ${trade.isWin ? 'win' : 'loss'}">
                    ${trade.isWin ? '+' : '-'}$${Math.abs(trade.profit).toFixed(2)}
                </div>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    closeModal() {
        document.getElementById('setupModal').classList.remove('show');
    }
    
    updateSessionTimer() {
        // This updates through the chart.js, but we keep it here for completeness
        setInterval(() => {
            // Timer is updated by chart.js
        }, 1000);
    }
    
    startBackgroundUpdates() {
        // Simulate background updates
        setInterval(() => {
            // Random price fluctuations
            const fluctuation = (Math.random() - 0.5) * 0.002; // ±0.2%
            const currentAsset = this.assets?.find(a => a.symbol === this.state.selectedAsset);
            
            if (currentAsset) {
                currentAsset.price *= (1 + fluctuation);
                currentAsset.change = ((currentAsset.price - 45320.50) / 45320.50 * 100).toFixed(2);
                
                // Update asset display if selected
                if (window.chart && window.chart.currentAsset === this.state.selectedAsset) {
                    document.getElementById('currentPrice').textContent = `$${currentAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                }
            }
        }, 5000);
        
        // Check alerts
        setInterval(() => {
            this.checkAlerts();
        }, 30000); // Check every 30 seconds
    }
    
    checkAlerts() {
        const currentPrice = window.chart?.candleData?.slice(-1)[0]?.c || 45320.50;
        
        this.state.alerts.forEach((alert, index) => {
            if (!alert.active) return;
            
            let triggered = false;
            let message = '';
            
            if (alert.type === 'buy' && currentPrice > alert.price) {
                triggered = true;
                message = `🎯 BUY Alert: ${alert.asset} reached $${alert.price.toFixed(2)}`;
            } else if (alert.type === 'sell' && currentPrice < alert.price) {
                triggered = true;
                message = `🎯 SELL Alert: ${alert.asset} reached $${alert.price.toFixed(2)}`;
            } else if (alert.type === 'custom') {
                const percentDiff = Math.abs((currentPrice - alert.price) / alert.price * 100);
                if (percentDiff < 0.5) { // Within 0.5%
                    triggered = true;
                    message = `🔔 Price Alert: ${alert.asset} near $${alert.price.toFixed(2)}`;
                }
            }
            
            if (triggered) {
                this.showToast(message, 'warning');
                alert.active = false;
                
                // Remove after 24 hours
                setTimeout(() => {
                    this.state.alerts.splice(index, 1);
                    this.saveState();
                    this.updateAlertsList();
                }, 86400000);
            }
        });
        
        this.updateAlertsList();
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${this.getToastIcon(type)} toast-icon"></i>
            <div class="toast-content">
                <h4>${this.getToastTitle(type)}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    getToastIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }
    
    getToastTitle(type) {
        switch(type) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'warning': return 'Warning';
            case 'info': return 'Information';
            default: return 'Notification';
        }
    }
}

// Initialize platform when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.platform = new TradingPlatform();
    });
} else {
    window.platform = new TradingPlatform();
}
