/**
 * Abacus Game Logic
 * Handles state management, UI rendering, and Win Conditions.
 */

// --- Game State ---
let abacusState = [0, 0, 0, 0, 0];
let targetNumber = 0;
const MAX_DIGITS = 5;

// --- DOM Elements ---
const targetDisplay = document.getElementById('target-number');
const currentDisplay = document.getElementById('current-number');
const statusMessage = document.getElementById('status-message');
const nextButton = document.getElementById('next-btn');
const overlayNextButton = document.getElementById('overlay-next-btn');
const abacusFrame = document.getElementById('abacus-frame');
const controlsContainer = document.getElementById('controls-container');
const successOverlay = document.getElementById('success-overlay');

// --- Initialization ---
function initGame() {
    renderInterface();
    startNewQuestion();
    
    // Listeners for both "New Question" buttons (main UI and Overlay)
    nextButton.addEventListener('click', startNewQuestion);
    overlayNextButton.addEventListener('click', startNewQuestion);
}

/**
 * Builds the visual structure (Rods and Buttons)
 */
function renderInterface() {
    abacusFrame.innerHTML = '';
    controlsContainer.innerHTML = '';

    for (let i = 0; i < MAX_DIGITS; i++) {
        // Create Rod
        const rod = document.createElement('div');
        rod.className = `rod rod-${i}`;
        rod.id = `rod-${i}`;
        abacusFrame.appendChild(rod);

        // Create Controls
        const group = document.createElement('div');
        group.className = 'control-group';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.className = 'ctrl-btn btn-minus';
        minusBtn.onclick = () => updateRod(i, -1);

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.className = 'ctrl-btn btn-plus';
        plusBtn.onclick = () => updateRod(i, 1);

        group.appendChild(minusBtn);
        group.appendChild(plusBtn);
        controlsContainer.appendChild(group);
    }
}

/**
 * Resets state, hides overlay, and sets new target.
 */
function startNewQuestion() {
    // 1. Generate new target
    targetNumber = Math.floor(Math.random() * 99999) + 1;
    
    // 2. Reset Abacus State
    abacusState = [0, 0, 0, 0, 0];
    
    // 3. UI Updates
    targetDisplay.textContent = targetNumber.toLocaleString();
    
    // Hide Overlay if it's open
    successOverlay.classList.remove('visible');
    
    // Reset buttons to disabled
    nextButton.disabled = true;
    nextButton.textContent = "Solve to Continue";
    
    statusMessage.textContent = "Start adding beads...";
    
    // Update visual beads
    updateVisuals();
}

/**
 * Handles bead updates and Carry Over logic.
 */
function updateRod(rodIndex, change) {
    if (change === -1) {
        if (abacusState[rodIndex] > 0) {
            abacusState[rodIndex]--;
        }
    } else if (change === 1) {
        addBeadRecursive(rodIndex);
    }

    updateVisuals();
    checkWinCondition();
}

/**
 * Recursive Carry Over Logic
 */
function addBeadRecursive(index) {
    if (index < 0) return; // Stop if we go past the first rod

    abacusState[index]++;

    // If > 9, reset to 0 and carry 1 to the left
    if (abacusState[index] > 9) {
        abacusState[index] = 0;
        addBeadRecursive(index - 1);
    }
}

/**
 * Updates beads on screen and calculates current value.
 */
function updateVisuals() {
    for (let i = 0; i < MAX_DIGITS; i++) {
        const rodEl = document.getElementById(`rod-${i}`);
        rodEl.innerHTML = ''; // Clear current beads
        
        const beadCount = abacusState[i];
        for (let b = 0; b < beadCount; b++) {
            const bead = document.createElement('div');
            bead.className = 'bead';
            rodEl.appendChild(bead);
        }
    }

    const currentVal = parseInt(abacusState.join(''));
    currentDisplay.textContent = currentVal.toLocaleString();
}

/**
 * Checks if matched. Triggers Overlay if true.
 */
function checkWinCondition() {
    const currentVal = parseInt(abacusState.join(''));

    if (currentVal === targetNumber) {
        // SUCCESS: Show Overlay
        statusMessage.textContent = "You matched the number!";
        nextButton.disabled = false;
        nextButton.textContent = "New Question";
        
        // Trigger the Congratulation Overlay
        successOverlay.classList.add('visible');
        
    } else {
        // INCOMPLETE
        statusMessage.textContent = "Keep adjusting the beads...";
        nextButton.disabled = true;
        nextButton.textContent = "Solve to Continue";
    }
}

// Start Game
initGame();