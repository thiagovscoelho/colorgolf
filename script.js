let currentColor = [100, 100, 100]; // Initial color (RGB)
let targetColor = [150, 200, 175]; // Target color (RGB)
let moveCount = 0;
let hintCount = 0;
let isDailyGame = false;
let hintUsedThisMove = false;
let tolerance = 26; // Default tolerance
let isBritish = false;

document.addEventListener("DOMContentLoaded", () => {
    checkBritish();
    updateColors();
});

function checkBritish() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('british')) {
        document.title = "Colour Golf";
        document.querySelector('h1').innerText = "Colour Golf";
        isBritish = true;

        // Update the instructions text
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.innerHTML = instructions.innerHTML.replace(/color/g, 'colour').replace(/Color/g, 'Colour');
        }
    }
}

function updateColors() {
    document.querySelector('.current-color').style.backgroundColor = `rgb(${currentColor.join(',')})`;
    document.querySelector('.target-color').style.backgroundColor = `rgb(${targetColor.join(',')})`;
}

function makeMove() {
    const redChange = parseInt(document.getElementById('red-input').value) || 0;
    const greenChange = parseInt(document.getElementById('green-input').value) || 0;
    const blueChange = parseInt(document.getElementById('blue-input').value) || 0;

    const changes = [redChange, greenChange, blueChange];

    currentColor = currentColor.map((value, index) => Math.max(0, Math.min(255, value + changes[index])));
    moveCount++;
    hintUsedThisMove = false; // Reset hint usage for the new move
    document.getElementById('moves').innerHTML += `<li>${changes.join(', ')}</li>`;
    document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
    updateColors();
    console.log(`Move made: ${currentColor}`);
    checkWin();
}

function calculateDifference() {
    const difference = currentColor.reduce((sum, value, index) => sum + Math.abs(value - targetColor[index]), 0);
    console.log(`Difference calculated: ${difference}`);
    return difference;
}

function checkWin() {
    const difference = calculateDifference();
    console.log(`Checking win condition: Difference = ${difference}, Tolerance = ${tolerance}`);
    if (difference <= tolerance) {
        displayWinMessage(difference);
    }
}

function displayWinMessage(difference) {
    const winMessage = document.createElement('div');
    winMessage.id = 'win-message';
    winMessage.innerText = `You won! Difference: ${difference}`;
    
    const tweetButton = document.createElement('a');
    tweetButton.className = 'twitter-share-button';
    tweetButton.innerText = 'Tweet';
    
    const toleranceText = tolerance === 0 ? 'Hard' : tolerance === 60 ? 'Easy' : 'Default';
    const gameTitle = isBritish ? '#ColourGolf' : '#ColorGolf';
    const tweetText = isDailyGame
        ? `I won today’s ${gameTitle} in ${moveCount} moves with ${toleranceText} tolerance! (${new Date().toISOString().split('T')[0]}) (used ${hintCount} hints)`
        : `I won a random ${gameTitle} game in ${moveCount} moves with ${toleranceText} tolerance! (used ${hintCount} hints)`;
    
    tweetButton.setAttribute('href', `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`);
    
    winMessage.appendChild(tweetButton);
    
    const gameContent = document.getElementById('game-content');
    const inputSection = document.querySelector('.input-section');
    gameContent.insertBefore(winMessage, inputSection);
    
    // Load Twitter's widgets.js script to render the Tweet button
    if (typeof twttr !== 'undefined') {
        twttr.widgets.load();
    } else {
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
    }
}

function getHint() {
    if (hintUsedThisMove) return; // Prevent multiple hints in the same move

    const currentHSL = rgbToHsl(...currentColor);
    const targetHSL = rgbToHsl(...targetColor);
    
    const hueHint = currentHSL[0] < targetHSL[0] ? 'increase Hue' : 'decrease Hue';
    const saturationHint = currentHSL[1] < targetHSL[1] ? 'increase Saturation' : 'decrease Saturation';
    const lightnessHint = currentHSL[2] < targetHSL[2] ? 'increase Lightness' : 'decrease Lightness';
    
    document.getElementById('hint-message').innerText = `${hueHint}, ${saturationHint}, ${lightnessHint}`;
    hintCount++;
    hintUsedThisMove = true; // Mark that a hint has been used in this move
    document.getElementById('hints-used').innerText = `Hints Used: ${hintCount}`;
}

function startDailyGame() {
    isDailyGame = true;
    const date = new Date();
    const seed1 = hashCode(date.toDateString() + "current");
    const seed2 = hashCode(date.toDateString() + "target");
    currentColor = generateColorFromSeed(seed1);
    targetColor = generateColorFromSeed(seed2);
    setTolerance();
    document.getElementById('game-title').innerText = `Daily Game for ${date.toDateString()}`;
    document.getElementById('game-mode-selection').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    updateColors();
    console.log(`Daily game started with target color: ${targetColor} and initial color: ${currentColor}`);
}

function startRandomGame() {
    isDailyGame = false;
    currentColor = generateRandomColor();
    targetColor = generateRandomColor();
    setTolerance();
    document.getElementById('game-title').innerText = 'Random Game';
    document.getElementById('game-mode-selection').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    updateColors();
    console.log(`Random game started with target color: ${targetColor} and initial color: ${currentColor}`);
}

function setTolerance() {
    const toleranceSelect = document.getElementById('tolerance-select').value;
    if (toleranceSelect === 'hard') {
        tolerance = 0;
    } else if (toleranceSelect === 'easy') {
        tolerance = 60;
    } else {
        tolerance = 26;
    }
    console.log(`Tolerance set to: ${tolerance}`);
}

function generateColorFromSeed(seed) {
    const r = (seed % 256);
    const g = ((seed >> 8) % 256);
    const b = ((seed >> 16) % 256);
    return [r, g, b];
}

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return [r, g, b];
}

// Simple hash function
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
