let currentColor = [100, 100, 100]; // Initial color (RGB)
let targetColor = [150, 200, 175]; // Target color (RGB)
let moveCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    updateColors();
});

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
    document.getElementById('moves').innerHTML += `<li>${changes.join(', ')}</li>`;
    document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
    updateColors();
    checkWin();
}

function checkWin() {
    if (JSON.stringify(currentColor) === JSON.stringify(targetColor)) {
        alert("Congratulations! You've matched the color!");
    }
}

function startDailyGame() {
    const date = new Date();
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    targetColor = generateColorFromSeed(seed);
    document.getElementById('game-title').innerText = `Daily Game for ${date.toDateString()}`;
    document.getElementById('game-mode-selection').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    updateColors();
}

function startRandomGame() {
    targetColor = generateRandomColor();
    document.getElementById('game-title').innerText = 'Random Game';
    document.getElementById('game-mode-selection').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
