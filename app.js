// Staff data structure: { red: [{name: '', lifeguard: false}, ...], blue: [...], orange: [...], green: [...] }
let staffData = {
    red: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
    blue: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
    orange: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
    green: Array(6).fill(null).map(() => ({name: '', lifeguard: false}))
};

// Track which group is currently on break (null or 'red', 'blue', 'orange', 'green')
let onBreakGroup = null;

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
        const parsed = JSON.parse(savedData);
        // Migrate old data format if needed
        staffData = migrateData(parsed);
    }

    const savedBreakGroup = localStorage.getItem('summerCampOnBreak');
    if (savedBreakGroup) {
        onBreakGroup = savedBreakGroup;
    }
}

// Migrate old data format to new format
function migrateData(data) {
    const migrated = {};
    Object.keys(data).forEach(group => {
        if (Array.isArray(data[group])) {
            migrated[group] = data[group].map(item => {
                if (typeof item === 'string') {
                    return {name: item, lifeguard: false};
                }
                return item;
            });
        }
    });
    return migrated;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('summerCampStaff', JSON.stringify(staffData));
    if (onBreakGroup) {
        localStorage.setItem('summerCampOnBreak', onBreakGroup);
    } else {
        localStorage.removeItem('summerCampOnBreak');
    }
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

    // Add click listeners to all lifeguard toggle buttons
    document.querySelectorAll('.lifeguard-toggle').forEach(button => {
        button.addEventListener('click', handleLifeguardToggle);
    });

    // Add change listeners to all break checkboxes
    document.querySelectorAll('.break-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleBreakCheckbox);
    });
}

// Handle staff input changes
function handleStaffInput(e) {
    const input = e.target;
    const group = input.getAttribute('data-group');
    const index = parseInt(input.getAttribute('data-index'));
    const value = input.value.trim();

    // Update the staff data
    staffData[group][index].name = value;

    // Save to localStorage
    saveData();

    // Update the count display
    updateGroupCount(group);
}

// Handle lifeguard toggle
function handleLifeguardToggle(e) {
    const button = e.target;
    const group = button.getAttribute('data-group');
    const index = parseInt(button.getAttribute('data-index'));

    // Toggle the lifeguard status
    staffData[group][index].lifeguard = !staffData[group][index].lifeguard;

    // Update visual state
    if (staffData[group][index].lifeguard) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }

    // Save to localStorage
    saveData();
}

// Handle break checkbox change
function handleBreakCheckbox(e) {
    const checkbox = e.target;
    const group = checkbox.getAttribute('data-group');

    if (checkbox.checked) {
        // Uncheck all other checkboxes
        document.querySelectorAll('.break-checkbox').forEach(cb => {
            if (cb !== checkbox) {
                cb.checked = false;
            }
        });

        // Set this group as on break
        onBreakGroup = group;
    } else {
        // No group is on break
        onBreakGroup = null;
    }

    // Save to localStorage
    saveData();
}

// Load staff data into input fields
function loadStaffIntoInputs() {
    Object.keys(staffData).forEach(group => {
        for (let i = 0; i < 6; i++) {
            const input = document.querySelector(`.staff-input[data-group="${group}"][data-index="${i}"]`);
            const button = document.querySelector(`.lifeguard-toggle[data-group="${group}"][data-index="${i}"]`);

            if (input && staffData[group][i]) {
                input.value = staffData[group][i].name;
            }

            if (button && staffData[group][i]) {
                if (staffData[group][i].lifeguard) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        }

        // Load break checkbox state
        const checkbox = document.querySelector(`.break-checkbox[data-group="${group}"]`);
        if (checkbox) {
            checkbox.checked = (onBreakGroup === group);
        }

        updateGroupCount(group);
    });
}

// Update group count display
function updateGroupCount(group) {
    const groupElement = document.querySelector(`.${group}-group`);
    if (!groupElement) return;

    const countSpan = groupElement.querySelector('.count');
    const filledCount = staffData[group].filter(staff => staff.name !== '').length;

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
            red: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
            blue: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
            orange: Array(6).fill(null).map(() => ({name: '', lifeguard: false})),
            green: Array(6).fill(null).map(() => ({name: '', lifeguard: false}))
        };
        onBreakGroup = null;
        saveData();
        loadStaffIntoInputs();
    }
}
