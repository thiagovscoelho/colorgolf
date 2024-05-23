let currentColor = [100, 100, 100]; // Initial color (RGB)
let targetColor = [150, 200, 175]; // Target color (RGB)

document.addEventListener("DOMContentLoaded", () => {
    updateColors();
});

function updateColors() {
    document.querySelector('.current-color').style.backgroundColor = `rgb(${currentColor.join(',')})`;
    document.querySelector('.target-color').style.backgroundColor = `rgb(${targetColor.join(',')})`;
}

function makeMove() {
    const input = document.getElementById('rgb-input').value;
    const changes = input.match(/[-+]?\d+/g).map(Number);

    if (changes.length !== 3) {
        alert("Please enter exactly three numbers.");
        return;
    }

    currentColor = currentColor.map((value, index) => Math.max(0, Math.min(255, value + changes[index])));
    document.getElementById('moves').innerHTML += `<li>${input}</li>`;
    updateColors();
    checkWin();
}

function checkWin() {
    if (JSON.stringify(currentColor) === JSON.stringify(targetColor)) {
        alert("Congratulations! You've matched the color!");
    }
}
