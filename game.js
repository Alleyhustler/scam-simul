// Game State
let gameState = {
    deployed: false,
    mcap: 4000,
    devCut: 20,
    growthRate: 1.05,
    volatility: 0.2,
    growthInterval: 1000, // ms
    rugInterval: null,
    totalRugged: 0,
    currentRug: 0,
    chartData: [],
    maxChartPoints: 30
};

// DOM Elements
const deployBtn = document.getElementById('deploy-btn');
const rugBtn = document.getElementById('rug-btn');
const mcapDisplay = document.getElementById('mcap');
const devCutDisplay = document.getElementById('dev-cut');
const potentialRugDisplay = document.getElementById('potential-rug');
const totalRuggedDisplay = document.getElementById('total-rugged');
const coinImage = document.getElementById('coin-image');
const priceChart = document.getElementById('price-chart');

// Initialize game
function initGame() {
    deployBtn.addEventListener('click', deployCoin);
    rugBtn.addEventListener('click', rugPull);
    
    // Randomize dev cut between 15-25%
    gameState.devCut = 15 + Math.floor(Math.random() * 11);
    devCutDisplay.textContent = gameState.devCut;
    
    updatePotentialRug();
}

// Deploy new coin
function deployCoin() {
    if (gameState.deployed) return;
    
    gameState.deployed = true;
    gameState.mcap = 4000;
    gameState.chartData = [gameState.mcap];
    gameState.currentRug = 0;
    
    // Randomize growth and volatility slightly
    gameState.growthRate = 1.03 + Math.random() * 0.04;
    gameState.volatility = 0.15 + Math.random() * 0.1;
    
    deployBtn.disabled = true;
    rugBtn.disabled = false;
    coinImage.src = 'assets/coin-growing.png';
    
    // Start market growth
    gameState.rugInterval = setInterval(growMarket, gameState.growthInterval);
    
    // Start chart rendering
    renderChart();
}

// Market growth simulation
function growMarket() {
    // Base growth with some randomness
    let growthFactor = gameState.growthRate + (Math.random() * 0.02 - 0.01);
    
    // Add volatility
    growthFactor += (Math.random() - 0.5) * gameState.volatility;
    
    gameState.mcap = Math.floor(gameState.mcap * growthFactor);
    
    // Ensure market cap doesn't go below initial value
    if (gameState.mcap < 4000) {
        gameState.mcap = 4000;
    }
    
    // Update displays
    mcapDisplay.textContent = gameState.mcap.toLocaleString();
    updatePotentialRug();
    
    // Add to chart data
    gameState.chartData.push(gameState.mcap);
    if (gameState.chartData.length > gameState.maxChartPoints) {
        gameState.chartData.shift();
    }
}

// Calculate potential rug amount
function updatePotentialRug() {
    gameState.currentRug = Math.floor(gameState.mcap * (gameState.devCut / 100));
    potentialRugDisplay.textContent = gameState.currentRug.toLocaleString();
}

// Execute rug pull
function rugPull() {
    if (!gameState.deployed) return;
    
    clearInterval(gameState.rugInterval);
    
    // Add to total rugged
    gameState.totalRugged += gameState.currentRug;
    totalRuggedDisplay.textContent = gameState.totalRugged.toLocaleString();
    
    // Visual feedback
    coinImage.src = 'assets/coin-rug.png';
    rugBtn.disabled = true;
    
    // Add explosion effect
    priceChart.innerHTML = '<div class="explosion">💥</div>';
    
    // Update leaderboard
    updateLeaderboard(gameState.currentRug);
    
    // Reset after delay
    setTimeout(() => {
        gameState.deployed = false;
        deployBtn.disabled = false;
        priceChart.innerHTML = '';
        coinImage.src = 'assets/coin-new.png';
    }, 2000);
}

// Render price chart
function renderChart() {
    if (!gameState.deployed) return;
    
    // Clear previous chart
    priceChart.innerHTML = '';
    
    // Create canvas-like effect with divs
    const max = Math.max(...gameState.chartData);
    const min = Math.min(...gameState.chartData);
    const range = max - min || 1;
    const widthPerPoint = priceChart.offsetWidth / (gameState.maxChartPoints - 1);
    
    // Draw chart line
    for (let i = 1; i < gameState.chartData.length; i++) {
        const x1 = (i - 1) * widthPerPoint;
        const y1 = priceChart.offsetHeight - ((gameState.chartData[i - 1] - min) / range * priceChart.offsetHeight);
        const x2 = i * widthPerPoint;
        const y2 = priceChart.offsetHeight - ((gameState.chartData[i] - min) / range * priceChart.offsetHeight);
        
        const line = document.createElement('div');
        line.className = 'chart-line';
        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
        line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
        line.style.transformOrigin = '0 0';
        
        priceChart.appendChild(line);
    }
    
    // Schedule next render
    requestAnimationFrame(renderChart);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);