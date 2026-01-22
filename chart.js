// TradingChart.js - Complete Chart Implementation with Trend Line Strategy

class TradingChart {
    constructor() {
        this.chart = null;
        this.currentAsset = 'BTC/USD';
        this.currentTimeframe = '1h';
        this.trendLines = [];
        this.candleData = [];
        this.isDrawing = false;
        this.startPoint = null;
        this.currentLine = null;
        this.touchCounts = {};
        this.sessionActive = false;
        
        // Initialize with sample data
        this.initializeSampleData();
    }
    
    init() {
        this.initializeChart();
        this.setupEventListeners();
        this.startLiveUpdates();
        this.updateSessionStatus();
        this.populateAssets();
    }
    
    initializeSampleData() {
        // Generate sample candle data for multiple assets
        this.assets = [
            { symbol: 'BTC/USD', name: 'Bitcoin', price: 45320.50, change: 1.2 },
            { symbol: 'ETH/USD', name: 'Ethereum', price: 2450.75, change: 2.1 },
            { symbol: 'XRP/USD', name: 'Ripple', price: 0.5245, change: -0.5 },
            { symbol: 'SOL/USD', name: 'Solana', price: 102.30, change: 3.2 },
            { symbol: 'ADA/USD', name: 'Cardano', price: 0.4523, change: 1.8 },
            { symbol: 'DOT/USD', name: 'Polkadot', price: 7.89, change: -1.2 },
            { symbol: 'DOGE/USD', name: 'Dogecoin', price: 0.0856, change: 4.5 },
            { symbol: 'AVAX/USD', name: 'Avalanche', price: 36.78, change: 2.7 },
            { symbol: 'LINK/USD', name: 'Chainlink', price: 14.56, change: -0.8 },
            { symbol: 'MATIC/USD', name: 'Polygon', price: 0.8923, change: 1.5 },
            { symbol: 'BNB/USD', name: 'Binance Coin', price: 312.45, change: 0.9 },
            { symbol: 'UNI/USD', name: 'Uniswap', price: 6.34, change: -2.1 }
        ];
        
        // Generate initial candle data
        this.generateCandleData();
    }
    
    generateCandleData() {
        const basePrice = 45320.50;
        const volatility = basePrice * 0.02; // 2% volatility
        const candles = [];
        
        for (let i = 100; i >= 0; i--) {
            const open = basePrice + (Math.random() - 0.5) * volatility;
            const close = open + (Math.random() - 0.5) * volatility;
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;
            
            candles.push({
                x: new Date(Date.now() - i * 3600000), // 1 hour intervals
                o: open,
                h: high,
                l: low,
                c: close
            });
        }
        
        this.candleData = candles;
        
        // Generate sample trend lines
        this.generateSampleTrendLines();
    }
    
    generateSampleTrendLines() {
        // Sample upward trend line
        const startPrice = this.candleData[20].l - 1000;
        const endPrice = this.candleData[80].h + 1000;
        const upwardTrend = {
            id: 'trend_1',
            type: 'upward',
            start: { x: 20, y: startPrice },
            end: { x: 80, y: endPrice },
            color: 'rgba(16, 185, 129, 0.7)',
            width: 2,
            touches: 2, // Already touched twice
            touchesData: [25, 50] // Touch points
        };
        
        // Sample downward trend line
        const downwardStartPrice = this.candleData[10].h + 800;
        const downwardEndPrice = this.candleData[70].l - 800;
        const downwardTrend = {
            id: 'trend_2',
            type: 'downward',
            start: { x: 10, y: downwardStartPrice },
            end: { x: 70, y: downwardEndPrice },
            color: 'rgba(239, 68, 68, 0.7)',
            width: 2,
            touches: 1,
            touchesData: [30]
        };
        
        this.trendLines = [upwardTrend, downwardTrend];
        this.calculateTouchCounts();
    }
    
    calculateTouchCounts() {
        this.touchCounts = {};
        this.trendLines.forEach(trendLine => {
            this.touchCounts[trendLine.id] = trendLine.touches;
        });
    }
    
    initializeChart() {
        const ctx = document.getElementById('tradingChart').getContext('2d');
        
        // Check if Chart is already initialized
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Calculate chart data
        const labels = this.candleData.map((candle, i) => {
            const date = new Date(candle.x);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        
        const data = this.candleData.map(candle => ({
            x: candle.x,
            o: candle.o,
            h: candle.h,
            l: candle.l,
            c: candle.c
        }));
        
        // Create chart
        this.chart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: this.currentAsset,
                    data: data,
                    color: {
                        up: 'rgba(16, 185, 129, 0.8)',
                        down: 'rgba(239, 68, 68, 0.8)',
                        unchanged: 'rgba(148, 163, 184, 0.8)'
                    },
                    borderColor: {
                        up: '#10b981',
                        down: '#ef4444',
                        unchanged: '#94a3b8'
                    },
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                        borderWidth: 1,
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        boxPadding: 6,
                        callbacks: {
                            label: function(context) {
                                const candle = context.raw;
                                return [
                                    `Open: $${candle.o.toFixed(2)}`,
                                    `High: $${candle.h.toFixed(2)}`,
                                    `Low: $${candle.l.toFixed(2)}`,
                                    `Close: $${candle.c.toFixed(2)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HH:mm'
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        position: 'right',
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    candle: {
                        borderWidth: 1
                    }
                }
            }
        });
        
        // Draw trend lines
        this.drawTrendLines();
        
        // Update UI with current data
        this.updateChartUI();
    }
    
    drawTrendLines() {
        if (!this.chart || !this.trendLines.length) return;
        
        const annotations = [];
        
        this.trendLines.forEach(trendLine => {
            const annotation = {
                type: 'line',
                borderColor: trendLine.color,
                borderWidth: trendLine.width,
                borderDash: [5, 5],
                label: {
                    display: true,
                    content: `Touches: ${trendLine.touches}/3`,
                    backgroundColor: trendLine.color,
                    color: '#ffffff',
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    position: 'start'
                },
                scaleID: 'y',
                value: trendLine.start.y,
                endValue: trendLine.end.y,
                scaleID: 'x',
                value: trendLine.start.x,
                endValue: trendLine.end.x
            };
            
            annotations.push(annotation);
            
            // Draw touch points
            trendLine.touchesData.forEach((touchIndex, i) => {
                const candle = this.candleData[touchIndex];
                if (candle) {
                    const touchAnnotation = {
                        type: 'point',
                        backgroundColor: trendLine.color,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        radius: 6,
                        xValue: candle.x,
                        yValue: trendLine.type === 'upward' ? candle.l - 50 : candle.h + 50
                    };
                    annotations.push(touchAnnotation);
                }
            });
        });
        
        // Add annotations to chart
        this.chart.options.plugins.annotation = { annotations };
        this.chart.update();
    }
    
    updateChartUI() {
        // Update current price
        const lastCandle = this.candleData[this.candleData.length - 1];
        if (lastCandle) {
            const currentPrice = lastCandle.c;
            const changePercent = ((currentPrice - lastCandle.o) / lastCandle.o * 100).toFixed(2);
            
            document.getElementById('currentPrice').textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            document.getElementById('priceChange').textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
            document.getElementById('priceChange').style.color = changePercent >= 0 ? 'var(--success)' : 'var(--danger)';
        }
        
        // Update touch counts
        const activeTrendLine = this.trendLines.find(tl => tl.touches >= 2);
        if (activeTrendLine) {
            document.getElementById('touchesCount').textContent = `${activeTrendLine.touches}/3`;
            document.getElementById('setupStatus').textContent = 'ACTIVE SETUP';
            document.getElementById('setupStatus').style.background = 'var(--primary)';
        } else {
            document.getElementById('touchesCount').textContent = '0/3';
            document.getElementById('setupStatus').textContent = 'NO SETUP';
            document.getElementById('setupStatus').style.background = 'var(--text-gray)';
        }
        
        // Update session status
        document.getElementById('sessionActive').textContent = this.sessionActive ? 'ACTIVE' : 'CLOSED';
        document.getElementById('sessionActive').style.color = this.sessionActive ? 'var(--success)' : 'var(--danger)';
        
        // Update Break of Structure status
        const bosStatus = this.checkBreakOfStructure();
        document.getElementById('bosStatus').textContent = bosStatus;
        document.getElementById('bosStatus').style.color = bosStatus === 'Detected' ? 'var(--success)' : 'var(--text-gray)';
    }
    
    checkBreakOfStructure() {
        // Simple BOS detection based on recent price action
        const recentCandles = this.candleData.slice(-5);
        if (recentCandles.length < 5) return 'Not Detected';
        
        // Check for higher highs (bullish BOS)
        const highs = recentCandles.map(c => c.h);
        const isBullishBOS = highs.every((h, i) => i === 0 || h > highs[i - 1]);
        
        // Check for lower lows (bearish BOS)
        const lows = recentCandles.map(c => c.l);
        const isBearishBOS = lows.every((l, i) => i === 0 || l < lows[i - 1]);
        
        return isBullishBOS ? 'Bullish BOS' : isBearishBOS ? 'Bearish BOS' : 'Not Detected';
    }
    
    setupEventListeners() {
        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTimeframe(e.target.dataset.tf);
            });
        });
        
        // Draw trendline button
        document.getElementById('drawTrendline').addEventListener('click', () => {
            this.startDrawingMode();
        });
        
        // Auto detect button
        document.getElementById('autoDetectBtn').addEventListener('click', () => {
            this.autoDetectSetup();
        });
        
        // Asset selection
        document.getElementById('assetsGrid').addEventListener('click', (e) => {
            if (e.target.closest('.asset-item')) {
                const assetItem = e.target.closest('.asset-item');
                const symbol = assetItem.dataset.symbol;
                this.changeAsset(symbol);
            }
        });
        
        // Asset search
        document.getElementById('assetSearch').addEventListener('input', (e) => {
            this.filterAssets(e.target.value);
        });
        
        // Analyze setup button
        document.getElementById('analyzeSetupBtn').addEventListener('click', () => {
            this.analyzeCurrentSetup();
        });
        
        // Chart click for drawing
        const chartCanvas = document.getElementById('tradingChart');
        chartCanvas.addEventListener('mousedown', (e) => {
            if (this.isDrawing) {
                this.startDrawing(e);
            }
        });
        
        chartCanvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing && this.startPoint) {
                this.updateDrawing(e);
            }
        });
        
        chartCanvas.addEventListener('mouseup', () => {
            if (this.isDrawing) {
                this.finishDrawing();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDrawing) {
                this.cancelDrawing();
            }
            if (e.key === 't' && e.ctrlKey) {
                e.preventDefault();
                this.startDrawingMode();
            }
            if (e.key === 'a' && e.ctrlKey) {
                e.preventDefault();
                this.autoDetectSetup();
            }
        });
    }
    
    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        
        // Update active button
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tf === timeframe);
        });
        
        // Regenerate data for new timeframe
        this.generateCandleData();
        this.initializeChart();
        
        // Show notification
        this.showToast(`Switched to ${timeframe.toUpperCase()} timeframe`, 'info');
    }
    
    changeAsset(symbol) {
        const asset = this.assets.find(a => a.symbol === symbol);
        if (!asset) return;
        
        this.currentAsset = symbol;
        
        // Update selected asset
        document.querySelectorAll('.asset-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.symbol === symbol);
        });
        
        // Update chart title
        document.getElementById('selectedAsset').textContent = symbol;
        
        // Update price
        document.getElementById('currentPrice').textContent = `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        
        // Update price change
        document.getElementById('priceChange').textContent = `${asset.change >= 0 ? '+' : ''}${asset.change}%`;
        document.getElementById('priceChange').style.color = asset.change >= 0 ? 'var(--success)' : 'var(--danger)';
        
        // Regenerate chart data for new asset
        this.generateCandleData();
        this.initializeChart();
        
        // Show notification
        this.showToast(`Switched to ${symbol}`, 'info');
    }
    
    filterAssets(searchTerm) {
        const assetsGrid = document.getElementById('assetsGrid');
        const search = searchTerm.toLowerCase();
        
        this.assets.forEach(asset => {
            const item = document.querySelector(`.asset-item[data-symbol="${asset.symbol}"]`);
            if (item) {
                const visible = asset.symbol.toLowerCase().includes(search) || 
                              asset.name.toLowerCase().includes(search);
                item.style.display = visible ? 'block' : 'none';
            }
        });
    }
    
    populateAssets() {
        const assetsGrid = document.getElementById('assetsGrid');
        assetsGrid.innerHTML = '';
        
        this.assets.forEach(asset => {
            const assetItem = document.createElement('div');
            assetItem.className = `asset-item ${asset.symbol === this.currentAsset ? 'selected' : ''}`;
            assetItem.dataset.symbol = asset.symbol;
            assetItem.innerHTML = `
                <div class="asset-symbol">${asset.symbol}</div>
                <div class="asset-name">${asset.name}</div>
                <div style="font-size: 12px; margin-top: 5px; color: ${asset.change >= 0 ? 'var(--success)' : 'var(--danger)'}">
                    ${asset.change >= 0 ? '+' : ''}${asset.change}%
                </div>
            `;
            assetsGrid.appendChild(assetItem);
        });
    }
    
    startDrawingMode() {
        this.isDrawing = true;
        document.getElementById('drawTrendline').classList.add('active');
        this.showToast('Click and drag on chart to draw trend line', 'info');
    }
    
    startDrawing(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.startPoint = { x, y };
        this.currentLine = {
            start: { x, y },
            end: { x, y }
        };
    }
    
    updateDrawing(event) {
        if (!this.startPoint || !this.currentLine) return;
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.currentLine.end = { x, y };
        
        // Update temporary line visual
        this.drawTemporaryLine();
    }
    
    drawTemporaryLine() {
        // This would draw a temporary line on the canvas
        // For simplicity, we'll just update the chart
        if (this.currentLine) {
            const trendLine = {
                id: 'temp_' + Date.now(),
                type: this.currentLine.end.y < this.currentLine.start.y ? 'upward' : 'downward',
                start: this.convertToChartCoords(this.currentLine.start),
                end: this.convertToChartCoords(this.currentLine.end),
                color: 'rgba(59, 130, 246, 0.5)',
                width: 1,
                touches: 0,
                touchesData: []
            };
            
            this.trendLines.push(trendLine);
            this.drawTrendLines();
        }
    }
    
    convertToChartCoords(point) {
        // Convert screen coordinates to chart data coordinates
        const chartArea = this.chart.chartArea;
        const xScale = this.chart.scales.x;
        const yScale = this.chart.scales.y;
        
        const xValue = xScale.getValueForPixel(point.x);
        const yValue = yScale.getValueForPixel(point.y);
        
        return { x: xValue, y: yValue };
    }
    
    finishDrawing() {
        if (!this.currentLine) return;
        
        const newTrendLine = {
            id: 'trend_' + Date.now(),
            type: this.currentLine.end.y < this.currentLine.start.y ? 'upward' : 'downward',
            start: this.convertToChartCoords(this.currentLine.start),
            end: this.convertToChartCoords(this.currentLine.end),
            color: this.currentLine.end.y < this.currentLine.start.y ? 
                   'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)',
            width: 2,
            touches: 0,
            touchesData: []
        };
        
        // Calculate touches for the new trend line
        this.calculateTouches(newTrendLine);
        
        // Add to trend lines array
        this.trendLines.push(newTrendLine);
        
        // Update chart
        this.drawTrendLines();
        this.updateChartUI();
        
        // Reset drawing state
        this.isDrawing = false;
        this.startPoint = null;
        this.currentLine = null;
        document.getElementById('drawTrendline').classList.remove('active');
        
        // Show notification
        this.showToast('Trend line added successfully', 'success');
    }
    
    calculateTouches(trendLine) {
        // Calculate how many times price has touched this trend line
        const touches = [];
        
        this.candleData.forEach((candle, index) => {
            const lineY = this.getLineYAtX(trendLine, candle.x);
            if (lineY === null) return;
            
            // Check if candle touches the line (within 0.5% of the price)
            const tolerance = lineY * 0.005;
            if (Math.abs(candle.l - lineY) < tolerance || Math.abs(candle.h - lineY) < tolerance) {
                touches.push(index);
            }
        });
        
        trendLine.touches = touches.length;
        trendLine.touchesData = touches;
        this.touchCounts[trendLine.id] = touches.length;
        
        return touches.length;
    }
    
    getLineYAtX(trendLine, x) {
        // Calculate y value on the line at given x
        const x1 = trendLine.start.x;
        const y1 = trendLine.start.y;
        const x2 = trendLine.end.x;
        const y2 = trendLine.end.y;
        
        if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) {
            return null; // x is outside line segment
        }
        
        // Linear interpolation
        const slope = (y2 - y1) / (x2 - x1);
        return y1 + slope * (x - x1);
    }
    
    cancelDrawing() {
        this.isDrawing = false;
        this.startPoint = null;
        this.currentLine = null;
        document.getElementById('drawTrendline').classList.remove('active');
        this.showToast('Drawing cancelled', 'warning');
    }
    
    autoDetectSetup() {
        // Simulate auto-detection of trend line setups
        this.showToast('Scanning for trend line setups...', 'info');
        
        setTimeout(() => {
            const validTrendLines = this.trendLines.filter(tl => tl.touches >= 2);
            
            if (validTrendLines.length > 0) {
                const setup = validTrendLines[0];
                const message = `Found setup: ${setup.type} trend line with ${setup.touches} touches`;
                this.showToast(message, 'success');
                
                // Highlight the setup
                this.highlightSetup(setup);
            } else {
                this.showToast('No valid setups found', 'warning');
            }
        }, 1000);
    }
    
    highlightSetup(trendLine) {
        // Highlight the trend line
        trendLine.color = trendLine.type === 'upward' ? 
                         'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)';
        trendLine.width = 3;
        
        this.drawTrendLines();
        
        // Reset after 5 seconds
        setTimeout(() => {
            trendLine.color = trendLine.type === 'upward' ? 
                             'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
            trendLine.width = 2;
            this.drawTrendLines();
        }, 5000);
    }
    
    analyzeCurrentSetup() {
        const activeTrendLines = this.trendLines.filter(tl => tl.touches >= 2);
        
        if (activeTrendLines.length === 0) {
            this.showToast('No active trend line setup detected', 'warning');
            return;
        }
        
        const setup = activeTrendLines[0];
        const analysis = this.generateAnalysis(setup);
        
        // Update setup details
        document.getElementById('touchesCount').textContent = `${setup.touches}/3`;
        document.getElementById('bosStatus').textContent = this.checkBreakOfStructure();
        document.getElementById('timeframeCheck').textContent = this.currentTimeframe.toUpperCase() + ' Valid';
        
        // Show analysis in modal
        this.showAnalysisModal(analysis);
    }
    
    generateAnalysis(trendLine) {
        const isBullish = trendLine.type === 'upward';
        const touchesLeft = 3 - trendLine.touches;
        
        return {
            trendLine: trendLine,
            touchesLeft: touchesLeft,
            recommendation: touchesLeft > 0 ? 
                `Wait for ${touchesLeft} more touch${touchesLeft > 1 ? 'es' : ''}` : 
                'Ready for entry',
            entryCondition: isBullish ? 
                'Bullish Break of Structure confirmed' : 
                'Bearish Break of Structure confirmed',
            stopLoss: isBullish ? 
                'Below trend line' : 
                'Above trend line',
            takeProfit: '1:3 Risk/Reward ratio',
            sessionCheck: this.sessionActive ? 
                '✅ London Session Active' : 
                '❌ Outside London Session'
        };
    }
    
    showAnalysisModal(analysis) {
        // This would show a modal with detailed analysis
        const modalContent = `
            <h3>Setup Analysis</h3>
            <div class="analysis-details">
                <p><strong>Trend Line:</strong> ${analysis.trendLine.type}</p>
                <p><strong>Touches:</strong> ${analysis.trendLine.touches}/3</p>
                <p><strong>Recommendation:</strong> ${analysis.recommendation}</p>
                <p><strong>Entry Condition:</strong> ${analysis.entryCondition}</p>
                <p><strong>Stop Loss:</strong> ${analysis.stopLoss}</p>
                <p><strong>Take Profit:</strong> ${analysis.takeProfit}</p>
                <p><strong>Session:</strong> ${analysis.sessionCheck}</p>
            </div>
        `;
        
        this.showToast('Setup analysis complete', 'info');
        
        // In a real implementation, this would open a modal
        console.log('Analysis:', analysis);
    }
    
    updateSessionStatus() {
        const now = new Date();
        const gmtHours = now.getUTCHours();
        
        // London Session: 8 AM - 5 PM GMT
        this.sessionActive = gmtHours >= 8 && gmtHours < 17;
        
        // Update timer display
        this.updateSessionTimer();
        
        // Update UI
        const sessionStatus = document.getElementById('sessionStatus');
        const sessionTimer = document.getElementById('sessionTimer');
        const currentGMT = document.getElementById('currentGMT');
        
        if (this.sessionActive) {
            sessionStatus.className = 'session-status active';
            sessionStatus.innerHTML = '<i class="fas fa-check-circle"></i> SESSION ACTIVE';
            sessionTimer.style.color = 'var(--success)';
        } else {
            sessionStatus.className = 'session-status closed';
            sessionStatus.innerHTML = '<i class="fas fa-times-circle"></i> SESSION CLOSED';
            sessionTimer.style.color = 'var(--danger)';
        }
        
        // Update GMT time
        currentGMT.textContent = now.toUTCString().split(' ')[4];
        
        // Update every minute
        setTimeout(() => this.updateSessionStatus(), 60000);
    }
    
    updateSessionTimer() {
        const now = new Date();
        const gmtHours = now.getUTCHours();
        
        let sessionEnd;
        if (gmtHours < 8) {
            // Before session starts
            sessionEnd = new Date(now);
            sessionEnd.setUTCHours(8, 0, 0, 0);
        } else if (gmtHours < 17) {
            // During session
            sessionEnd = new Date(now);
            sessionEnd.setUTCHours(17, 0, 0, 0);
        } else {
            // After session ends
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setUTCHours(8, 0, 0, 0);
            sessionEnd = tomorrow;
        }
        
        const timeLeft = sessionEnd - now;
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('sessionTimer').textContent = timerDisplay;
    }
    
    startLiveUpdates() {
        // Simulate live price updates
        setInterval(() => {
            this.updateLivePrices();
        }, 3000); // Update every 3 seconds
    }
    
    updateLivePrices() {
        if (!this.candleData.length) return;
        
        const lastCandle = this.candleData[this.candleData.length - 1];
        const change = (Math.random() - 0.5) * 0.001; // Random small change
        
        // Update last candle
        lastCandle.c = lastCandle.c * (1 + change);
        lastCandle.h = Math.max(lastCandle.h, lastCandle.c);
        lastCandle.l = Math.min(lastCandle.l, lastCandle.c);
        
        // Add new candle every minute (simulated)
        const now = Date.now();
        const lastCandleTime = new Date(lastCandle.x).getTime();
        
        if (now - lastCandleTime > 60000) { // 1 minute
            const newCandle = {
                x: new Date(now),
                o: lastCandle.c,
                h: lastCandle.c * (1 + Math.random() * 0.002),
                l: lastCandle.c * (1 - Math.random() * 0.002),
                c: lastCandle.c * (1 + (Math.random() - 0.5) * 0.001)
            };
            
            this.candleData.push(newCandle);
            // Keep only last 100 candles
            if (this.candleData.length > 100) {
                this.candleData.shift();
            }
        }
        
        // Update chart
        if (this.chart) {
            this.chart.data.datasets[0].data = this.candleData;
            this.chart.update('none'); // Update without animation
            
            // Update UI
            this.updateChartUI();
            
            // Check for new trend line touches
            this.checkForNewTouches();
        }
    }
    
    checkForNewTouches() {
        let newTouchDetected = false;
        
        this.trendLines.forEach(trendLine => {
            const lastCandle = this.candleData[this.candleData.length - 1];
            if (!lastCandle) return;
            
            const lineY = this.getLineYAtX(trendLine, lastCandle.x);
            if (lineY === null) return;
            
            const tolerance = lineY * 0.005; // 0.5% tolerance
            const touchesLine = Math.abs(lastCandle.l - lineY) < tolerance || 
                              Math.abs(lastCandle.h - lineY) < tolerance;
            
            if (touchesLine && !trendLine.touchesData.includes(this.candleData.length - 1)) {
                trendLine.touches++;
                trendLine.touchesData.push(this.candleData.length - 1);
                newTouchDetected = true;
                
                // Show notification for 3rd touch
                if (trendLine.touches === 3) {
                    this.showToast(`✅ 3rd Touch Detected on ${trendLine.type} trend line! Ready for entry.`, 'success');
                }
            }
        });
        
        if (newTouchDetected) {
            this.drawTrendLines();
            this.updateChartUI();
        }
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

// Initialize chart when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chart = new TradingChart();
        window.chart.init();
    });
} else {
    window.chart = new TradingChart();
    window.chart.init();
}
