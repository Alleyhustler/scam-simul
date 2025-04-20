// Leaderboard functionality
const leaderboardList = document.getElementById('leaderboard-list');
let leaderboard = JSON.parse(localStorage.getItem('rugLeaderboard')) || [];

// Update leaderboard with new rug
function updateLeaderboard(rugAmount) {
    // Get player name or use "Anonymous"
    const playerName = walletConnected ? 
        publicKey.slice(0, 4) + "..." + publicKey.slice(-4) : 
        "Anonymous";
    
    // Add new entry
    leaderboard.push({
        name: playerName,
        amount: rugAmount,
        timestamp: Date.now()
    });
    
    // Sort by rug amount (descending)
    leaderboard.sort((a, b) => b.amount - a.amount);
    
    // Keep only top 10
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('rugLeaderboard', JSON.stringify(leaderboard));
    
    // Update display
    renderLeaderboard();
}

// Render leaderboard
function renderLeaderboard() {
    leaderboardList.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="rank">${index + 1}.</span>
            <span class="name">${entry.name}</span>
            <span class="amount">${entry.amount.toLocaleString()} SOL</span>
        `;
        leaderboardList.appendChild(li);
    });
}

// Initialize leaderboard
function initLeaderboard() {
    renderLeaderboard();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLeaderboard);