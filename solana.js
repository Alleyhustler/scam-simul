// Solana Wallet Connection
let walletConnected = false;
let publicKey = null;
const connectBtn = document.getElementById('connect-btn');

// Initialize Solana connection
async function initSolana() {
    if (window.solana && window.solana.isPhantom) {
        connectBtn.addEventListener('click', connectWallet);
    } else {
        connectBtn.textContent = "Phantom Not Installed";
        connectBtn.disabled = true;
    }
}

// Connect to Phantom wallet
async function connectWallet() {
    try {
        const response = await window.solana.connect();
        publicKey = response.publicKey.toString();
        walletConnected = true;
        connectBtn.textContent = "Connected: " + publicKey.slice(0, 4) + "..." + publicKey.slice(-4);
        connectBtn.disabled = true;
    } catch (err) {
        console.error("Wallet connection error:", err);
        connectBtn.textContent = "Connection Failed";
        setTimeout(() => {
            connectBtn.textContent = "Connect Wallet";
        }, 2000);
    }
}

// Simulate SOL transfer (in a real app, this would use actual Solana transactions)
async function simulateSolTransfer(amount) {
    if (!walletConnected) return false;
    
    // In a real implementation, you would:
    // 1. Create transaction
    // 2. Send to user's wallet
    // 3. Confirm transaction
    
    console.log(`Simulating transfer of ${amount} SOL to ${publicKey}`);
    return true;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSolana);