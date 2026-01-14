// Staff data structure: { red: ['', '', '', '', '', ''], blue: [...], orange: [...], green: [...] }
let staffData = {
    red: ['', '', '', '', '', ''],
    blue: ['', '', '', '', '', ''],
    orange: ['', '', '', '', '', ''],
    green: ['', '', '', '', '', '']
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
    loadStaffIntoInputs();
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('summerCampStaff');
    if (savedData) {
        staffData = JSON.parse(savedData);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('summerCampStaff', JSON.stringify(staffData));
}

// Initialize event listeners
function initializeEventListeners() {
    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    // Add input listeners to all staff input fields
    document.querySelectorAll('.staff-input').forEach(input => {
        input.addEventListener('input', handleStaffInput);
        input.addEventListener('blur', handleStaffInput);
    });
}

// Handle staff input changes
function handleStaffInput(e) {
    const input = e.target;
    const group = input.getAttribute('data-group');
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value.trim();

    // Update the staff data
    staffData[group][index] = value;

    // Save to localStorage
    saveData();

    // Update the count display
    updateGroupCount(group);
}

// Load staff data into input fields
function loadStaffIntoInputs() {
    Object.keys(staffData).forEach(group => {
        for (let i = 0; i < 6; i++) {
            const input = document.querySelector(`[data-group="${group}"][data-index="${i}"]`);
            if (input) {
                input.value = staffData[group][i];
            }
        }
        updateGroupCount(group);
    });
}

// Update group count display
function updateGroupCount(group) {
    const groupElement = document.querySelector(`.${group}-group`);
    if (!groupElement) return;

    const countSpan = groupElement.querySelector('.count');
    const filledCount = staffData[group].filter(name => name !== '').length;

    countSpan.textContent = `${filledCount}/6`;

    // Highlight if full
    if (filledCount === 6) {
        countSpan.style.background = '#28a745';
        countSpan.style.color = 'white';
    } else {
        countSpan.style.background = 'rgba(0, 0, 0, 0.1)';
        countSpan.style.color = 'inherit';
    }
}

// Clear all data
function clearAll() {
    if (confirm('Are you sure you want to clear all staff data? This cannot be undone.')) {
        staffData = {
            red: ['', '', '', '', '', ''],
            blue: ['', '', '', '', '', ''],
            orange: ['', '', '', '', '', ''],
            green: ['', '', '', '', '', '']
        };
        saveData();
        loadStaffIntoInputs();
    }
}
