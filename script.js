/**
 * Interactive Abacus Game Logic
 * Implements state management, ripple-carry addition, and UI updates.
 */

// --- Game Constants & State ---
const MAX_DIGITS = 5; // Units, Tens, Hundreds, Thousands, Ten-Thousands
let abacusState = [0, 0, 0, 0, 0]; // Index 0 is Ten-Thousands (Leftmost), Index 4 is Units (Rightmost)
let targetNumber = 0;

// --- DOM Elements ---
const elements = {
    targetDisplay: document.getElementById('target-number'),
    currentDisplay: document.getElementById('current-number'),
    statusMessage: document.getElementById('status-message'),
    nextButton: document.getElementById('next-btn'),
    overlayNextButton: document.getElementById('overlay-next-btn'),
    abacusFrame: document.getElementById('abacus-frame'),
    controlsContainer: document.getElementById('controls-container'),
    successOverlay: document.getElementById('success-overlay')
};

// --- Initialization ---
function initGame() {
    renderInterface(); // [cite: 9, 10]
    startNewQuestion(); // [cite: 17]
    
    // Bind Event Listeners [cite: 24]
    elements.nextButton.addEventListener('click', startNewQuestion);
    elements.overlayNextButton.addEventListener('click', startNewQuestion);
}

/**
 * 1. Render Interface
 * Generates the HTML for rods and buttons dynamically.
 */
function renderInterface() {
    elements.abacusFrame.innerHTML = '';
    elements.controlsContainer.innerHTML = '';

    for (let i = 0; i < MAX_DIGITS; i++) {
        // Create Rod Visuals
        const rod = document.createElement('div');
        rod.className = `rod rod-${i}`; // Classes for styling specific columns
        rod.id = `rod-${i}`;
        elements.abacusFrame.appendChild(rod);

        // Create Control Buttons (+ and -) [cite: 11]
        const group = document.createElement('div');
        group.className = 'control-group';

        const minusBtn = createButton('-', 'btn-minus', () => updateRod(i, -1));
        const plusBtn = createButton('+', 'btn-plus', () => updateRod(i, 1));

        group.appendChild(minusBtn);
        group.appendChild(plusBtn);
        elements.controlsContainer.appendChild(group);
    }
}

// Helper to create buttons
function createButton(text, typeClass, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `ctrl-btn ${typeClass}`;
    btn.addEventListener('click', onClick);
    return btn;
}

/**
 * 2. Game Logic: Update Rods
 * Handles user interaction when + or - is clicked.
 */
function updateRod(rodIndex, change) {
    // LOGIC: Subtraction
    if (change === -1) {
        if (abacusState[rodIndex] > 0) {
            abacusState[rodIndex]--;
        }
    } 
    // LOGIC: Addition with Carry Over
    else if (change === 1) {
        addBeadRecursive(rodIndex);
    }

    // Update UI after state change [cite: 12]
    updateVisuals();
    checkWinCondition();
}

/**
 * CORE LOGIC: Recursive Carry Function
 * Adds a bead. Handles the specific constraints for carrying and capping.
 * @param {number} index - The index of the rod being modified (0-4)
 */
function addBeadRecursive(index) {
    // Safety check
    if (index < 0) return;

    // --- CASE 1: Leftmost Rod (Ten Thousands / Index 0) ---
    // Requirement: If 9 beads exist, do NOT reset to 0. Just stop adding.
    if (index === 0) {
        if (abacusState[0] < 9) {
            abacusState[0]++;
        }
        // If abacusState[0] is already 9, we do nothing (return).
        return; 
    }

    // --- CASE 2: Normal Rods (Index 1 to 4) ---
    // Requirement: If > 9, reset to 0 and carry over to the left 
    abacusState[index]++;

    if (abacusState[index] > 9) {
        // Reset current rod to 0
        abacusState[index] = 0;
        
        // RECURSIVE CALL: Add 1 to the rod on the left
        addBeadRecursive(index - 1);
    }
}

/**
 * 3. Visual Updates
 * Reflects the `abacusState` array onto the HTML DOM.
 */
function updateVisuals() {
    for (let i = 0; i < MAX_DIGITS; i++) {
        const rodEl = document.getElementById(`rod-${i}`);
        rodEl.innerHTML = ''; // Clear previous beads
        
        // Add beads based on current state [cite: 12]
        for (let b = 0; b < abacusState[i]; b++) {
            const bead = document.createElement('div');
            bead.className = 'bead';
            rodEl.appendChild(bead);
        }
    }

    // Calculate integer value from state array (e.g., [1,0,5,2,0] -> 10520) [cite: 14]
    const currentVal = parseInt(abacusState.join(''));
    elements.currentDisplay.textContent = currentVal.toLocaleString();
}

/**
 * 4. Game Control: New Question
 */
function startNewQuestion() {
    // Generate random number 1 - 99999 [cite: 8]
    targetNumber = Math.floor(Math.random() * 99999) + 1;
    
    // Reset User State
    abacusState = [0, 0, 0, 0, 0];
    
    // UI Resets
    elements.targetDisplay.textContent = targetNumber.toLocaleString();
    elements.statusMessage.textContent = "Start adding beads...";
    elements.statusMessage.className = "neutral-text";
    
    // Reset Buttons
    elements.nextButton.disabled = true; // [cite: 17]
    elements.nextButton.textContent = "Solve to Continue";
    
    // Hide Overlay
    elements.successOverlay.classList.remove('visible');

    updateVisuals();
}

/**
 * 5. Win Condition Check
 * Compares current value with target number. [cite: 15]
 */
function checkWinCondition() {
    const currentVal = parseInt(abacusState.join(''));

    if (currentVal === targetNumber) {
        handleWin();
    } else {
        handleIncomplete();
    }
}

function handleWin() {
    // Display status match message [cite: 16]
    elements.statusMessage.textContent = "You matched the number!";
    elements.statusMessage.className = "success-text";
    
    // Enable button
    elements.nextButton.disabled = false;
    elements.nextButton.textContent = "New Question";
    
    // Show Congratulations Overlay
    elements.successOverlay.classList.add('visible');
}

function handleIncomplete() {
    elements.statusMessage.textContent = "Keep adjusting the beads..."; // [cite: 16]
    elements.statusMessage.className = "neutral-text";
    
    // Disable button if answer is wrong
    elements.nextButton.disabled = true;
    elements.nextButton.textContent = "Solve to Continue";
}

// Start the game
initGame();