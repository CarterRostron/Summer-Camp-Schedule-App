// Staff data structure: { red: [{name: '', lifeguard: false, senior: false}, ...], blue: [...], orange: [...], green: [...] }
let staffData = {
    red: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
    blue: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
    orange: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
    green: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false}))
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
                    return {name: item, lifeguard: false, senior: false};
                }
                // Add senior field if it doesn't exist
                if (typeof item === 'object' && !item.hasOwnProperty('senior')) {
                    return {...item, senior: false};
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
    // Assign activity groups button
    document.getElementById('assignGroupsBtn').addEventListener('click', assignActivityGroups);

    // Generate chore groups button
    document.getElementById('generateChoreGroupsBtn').addEventListener('click', generateChoreGroups);

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

    // Add click listeners to all senior toggle buttons
    document.querySelectorAll('.senior-toggle').forEach(button => {
        button.addEventListener('click', handleSeniorToggle);
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

// Handle senior counselor toggle
function handleSeniorToggle(e) {
    const button = e.target;
    const group = button.getAttribute('data-group');
    const index = parseInt(button.getAttribute('data-index'));

    // Toggle the senior status
    staffData[group][index].senior = !staffData[group][index].senior;

    // Update visual state
    if (staffData[group][index].senior) {
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
            const lifeguardButton = document.querySelector(`.lifeguard-toggle[data-group="${group}"][data-index="${i}"]`);
            const seniorButton = document.querySelector(`.senior-toggle[data-group="${group}"][data-index="${i}"]`);

            if (input && staffData[group][i]) {
                input.value = staffData[group][i].name;
            }

            if (lifeguardButton && staffData[group][i]) {
                if (staffData[group][i].lifeguard) {
                    lifeguardButton.classList.add('active');
                } else {
                    lifeguardButton.classList.remove('active');
                }
            }

            if (seniorButton && staffData[group][i]) {
                if (staffData[group][i].senior) {
                    seniorButton.classList.add('active');
                } else {
                    seniorButton.classList.remove('active');
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

// Assign activity groups
function assignActivityGroups() {
    // Get staff organized by day-off group (excluding those on break)
    const staffByGroup = {};
    Object.keys(staffData).forEach(group => {
        if (group !== onBreakGroup) {
            staffByGroup[group] = staffData[group]
                .filter(staff => staff.name && staff.name.trim() !== '')
                .map(staff => ({
                    name: staff.name,
                    lifeguard: staff.lifeguard,
                    group: group
                }));
        }
    });

    const activeGroups = Object.keys(staffByGroup);
    if (activeGroups.length === 0) {
        alert('Please add staff members first!');
        return;
    }

    // Create 6 units with 1 person from each active day-off group
    const units = [];
    for (let i = 0; i < 6; i++) {
        const unit = [];
        activeGroups.forEach(group => {
            if (staffByGroup[group][i]) {
                unit.push(staffByGroup[group][i]);
            }
        });
        if (unit.length > 0) {
            units.push(unit);
        }
    }

    if (units.length === 0) {
        alert('Please add staff members first!');
        return;
    }

    // Track assignments to avoid repeats
    const freeTimeCount = {};
    const roleHistory = {};
    units.forEach(unit => {
        unit.forEach(staff => {
            freeTimeCount[staff.name] = 0;
            roleHistory[staff.name] = {};
        });
    });

    // Generate assignments for each period
    const amSwim = assignSwimPeriodByUnits(units, freeTimeCount, roleHistory);
    const activity1 = assignActivityPeriodByUnits(units, freeTimeCount, roleHistory);
    const activity2 = assignActivityPeriodByUnits(units, freeTimeCount, roleHistory);
    const pmSwim = assignSwimPeriodByUnits(units, freeTimeCount, roleHistory);

    // Display results
    displayAssignmentsByUnits('amSwimAssignments', amSwim);
    displayAssignmentsByUnits('activity1Assignments', activity1);
    displayAssignmentsByUnits('activity2Assignments', activity2);
    displayAssignmentsByUnits('pmSwimAssignments', pmSwim);

    // Show the activity section
    document.getElementById('activitySection').style.display = 'block';
}

// Assign roles for a swim period organized by units
function assignSwimPeriodByUnits(units, freeTimeCount, roleHistory) {
    // Flatten all staff across units
    const allStaff = units.flat();
    const shuffled = [...allStaff].sort(() => Math.random() - 0.5);

    const roleNeeds = {
        'Lifeguard': 1,
        'Watchers': 2,
        'Bongo': 1,
        'Medical Tent': 1,
        'Trail Sweeper': 1,
        'Free Time': 4
    };

    const assigned = {};
    const assignedSet = new Set();

    // Assign roles based on needs
    Object.keys(roleNeeds).forEach(role => {
        assigned[role] = [];
        const count = roleNeeds[role];

        for (let i = 0; i < count; i++) {
            let person = null;

            if (role === 'Lifeguard') {
                // Must be certified
                person = shuffled.find(s => s.lifeguard && !assignedSet.has(s.name) && !roleHistory[s.name][role]);
                if (!person) {
                    person = shuffled.find(s => s.lifeguard && !assignedSet.has(s.name));
                }
            } else if (role === 'Free Time') {
                // Prioritize those with fewer free times
                const available = shuffled.filter(s => !assignedSet.has(s.name));
                available.sort((a, b) => freeTimeCount[a.name] - freeTimeCount[b.name]);
                person = available[0];
            } else {
                // Try to find someone who hasn't had this role
                person = shuffled.find(s => !assignedSet.has(s.name) && !roleHistory[s.name][role]);
                if (!person) {
                    person = shuffled.find(s => !assignedSet.has(s.name));
                }
            }

            if (person) {
                assigned[role].push(person.name);
                assignedSet.add(person.name);
                roleHistory[person.name][role] = true;
                if (role === 'Free Time') {
                    freeTimeCount[person.name]++;
                }
            }
        }
    });

    // Not assigned
    assigned['Not Assigned'] = shuffled
        .filter(s => !assignedSet.has(s.name))
        .map(s => s.name);

    // Convert to unit-based display
    return convertToUnitDisplay(units, assigned);
}

// Assign roles for an activity period organized by units
function assignActivityPeriodByUnits(units, freeTimeCount, roleHistory) {
    const allStaff = units.flat();
    const shuffled = [...allStaff].sort(() => Math.random() - 0.5);

    const roleNeeds = {
        'Trail Sweeper': 1,
        'Medical Tent': 1,
        'Running Activity': 6,
        'Free Time': 5
    };

    const assigned = {};
    const assignedSet = new Set();

    // Assign roles based on needs
    Object.keys(roleNeeds).forEach(role => {
        assigned[role] = [];
        const count = roleNeeds[role];

        for (let i = 0; i < count; i++) {
            let person = null;

            if (role === 'Free Time') {
                // Prioritize those with fewer free times
                const available = shuffled.filter(s => !assignedSet.has(s.name));
                available.sort((a, b) => freeTimeCount[a.name] - freeTimeCount[b.name]);
                person = available[0];
            } else {
                // Try to find someone who hasn't had this role
                person = shuffled.find(s => !assignedSet.has(s.name) && !roleHistory[s.name][role]);
                if (!person) {
                    person = shuffled.find(s => !assignedSet.has(s.name));
                }
            }

            if (person) {
                assigned[role].push(person.name);
                assignedSet.add(person.name);
                roleHistory[person.name][role] = true;
                if (role === 'Free Time') {
                    freeTimeCount[person.name]++;
                }
            }
        }
    });

    // Not assigned
    assigned['Not Assigned'] = shuffled
        .filter(s => !assignedSet.has(s.name))
        .map(s => s.name);

    // Convert to unit-based display
    return convertToUnitDisplay(units, assigned);
}

// Convert role assignments to unit-based display
function convertToUnitDisplay(units, assigned) {
    const unitAssignments = [];

    units.forEach((unit, index) => {
        const unitNumber = index + 1;
        const unitStaff = {};

        unit.forEach(staff => {
            // Find what role this person was assigned
            let role = 'Not Assigned';
            for (const r in assigned) {
                if (assigned[r].includes(staff.name)) {
                    role = r;
                    break;
                }
            }
            unitStaff[staff.name] = role;
        });

        unitAssignments.push({
            unitNumber: unitNumber,
            assignments: unitStaff
        });
    });

    return unitAssignments;
}

// Display assignments by units in the UI
function displayAssignmentsByUnits(elementId, unitAssignments) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    unitAssignments.forEach(unit => {
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit-assignment';

        const unitHeader = document.createElement('div');
        unitHeader.className = 'unit-header';
        unitHeader.textContent = `Unit ${unit.unitNumber}`;
        unitDiv.appendChild(unitHeader);

        const staffList = document.createElement('div');
        staffList.className = 'unit-staff';

        Object.keys(unit.assignments).forEach(name => {
            const role = unit.assignments[name];
            const staffDiv = document.createElement('div');
            staffDiv.className = 'staff-role';
            staffDiv.innerHTML = `<strong>${name}:</strong> ${role}`;
            staffList.appendChild(staffDiv);
        });

        unitDiv.appendChild(staffList);
        container.appendChild(unitDiv);
    });
}

// Generate chore groups
function generateChoreGroups() {
    // Get all staff from all groups
    const dayOffGroups = ['red', 'blue', 'orange', 'green'];
    const allStaff = {};

    // Organize staff by day-off group
    dayOffGroups.forEach(group => {
        allStaff[group] = staffData[group]
            .filter(staff => staff.name && staff.name.trim() !== '')
            .map(staff => ({
                name: staff.name,
                senior: staff.senior,
                group: group
            }));
    });

    // Verify we have staff
    const totalStaff = Object.values(allStaff).reduce((sum, arr) => sum + arr.length, 0);
    if (totalStaff === 0) {
        alert('Please add staff members first!');
        return;
    }

    // Check if all groups have the same number of staff (ideally 6)
    const groupSizes = dayOffGroups.map(g => allStaff[g].length);
    const maxSize = Math.max(...groupSizes);

    // Create chore groups using a rotation pattern to avoid same-unit conflicts
    const choreGroups = [];
    for (let i = 0; i < maxSize; i++) {
        choreGroups.push([]);
    }

    // Assign staff to chore groups with rotation to avoid unit conflicts
    dayOffGroups.forEach((group, groupIndex) => {
        allStaff[group].forEach((staff, staffIndex) => {
            // Use rotation: (staffIndex + groupIndex) % maxSize
            const choreGroupIndex = (staffIndex + groupIndex) % maxSize;
            choreGroups[choreGroupIndex].push(staff);
        });
    });

    // Ensure each chore group has at least one senior counselor
    ensureSeniorInEachGroup(choreGroups);

    // Display the chore groups
    displayChoreGroups(choreGroups);

    // Show the chore section
    document.getElementById('choreSection').style.display = 'block';
}

// Ensure each chore group has at least one senior counselor
function ensureSeniorInEachGroup(choreGroups) {
    const groupsWithoutSenior = [];
    const groupsWithMultipleSeniors = [];

    // Identify groups with issues
    choreGroups.forEach((group, index) => {
        const seniorCount = group.filter(staff => staff.senior).length;
        if (seniorCount === 0) {
            groupsWithoutSenior.push(index);
        } else if (seniorCount > 1) {
            groupsWithMultipleSeniors.push(index);
        }
    });

    // Try to swap staff to fix groups without seniors
    groupsWithoutSenior.forEach(groupIndexWithoutSenior => {
        // Find a group with multiple seniors
        for (const groupIndexWithExtra of groupsWithMultipleSeniors) {
            const groupWithoutSenior = choreGroups[groupIndexWithoutSenior];
            const groupWithExtra = choreGroups[groupIndexWithExtra];

            // Find a senior in the group with extras
            const seniorIndex = groupWithExtra.findIndex(staff => staff.senior);
            if (seniorIndex === -1) continue;

            const senior = groupWithExtra[seniorIndex];

            // Find a non-senior in the group without senior from the same day-off group
            const nonSeniorIndex = groupWithoutSenior.findIndex(
                staff => !staff.senior && staff.group === senior.group
            );

            if (nonSeniorIndex !== -1) {
                // Swap them
                const nonSenior = groupWithoutSenior[nonSeniorIndex];
                groupWithoutSenior[nonSeniorIndex] = senior;
                groupWithExtra[seniorIndex] = nonSenior;

                // Update the tracking arrays
                const extraIdx = groupsWithMultipleSeniors.indexOf(groupIndexWithExtra);
                if (groupWithExtra.filter(s => s.senior).length <= 1) {
                    groupsWithMultipleSeniors.splice(extraIdx, 1);
                }
                break;
            }
        }
    });

    // If still have groups without seniors, try any valid swap
    choreGroups.forEach((group, index) => {
        const seniorCount = group.filter(staff => staff.senior).length;
        if (seniorCount === 0) {
            // Find any group with a senior and try to swap
            for (let otherIndex = 0; otherIndex < choreGroups.length; otherIndex++) {
                if (otherIndex === index) continue;

                const otherGroup = choreGroups[otherIndex];
                const seniorInOther = otherGroup.find(staff => staff.senior);
                if (!seniorInOther) continue;

                // Find someone in current group from same day-off group
                const swapCandidate = group.find(staff => staff.group === seniorInOther.group);
                if (swapCandidate) {
                    // Swap them
                    const seniorIdx = otherGroup.indexOf(seniorInOther);
                    const candidateIdx = group.indexOf(swapCandidate);
                    group[candidateIdx] = seniorInOther;
                    otherGroup[seniorIdx] = swapCandidate;
                    break;
                }
            }
        }
    });
}

// Display chore groups in the UI
function displayChoreGroups(choreGroups) {
    const container = document.getElementById('choreGroupsContainer');
    container.innerHTML = '';

    choreGroups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'chore-group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'chore-group-header';

        const hasSenior = group.some(staff => staff.senior);
        const seniorWarning = hasSenior ? '' : ' ⚠️ No Senior Counselor';
        groupHeader.textContent = `Chore Group ${index + 1}${seniorWarning}`;

        groupDiv.appendChild(groupHeader);

        const staffList = document.createElement('div');
        staffList.className = 'chore-group-staff';

        group.forEach(staff => {
            const staffDiv = document.createElement('div');
            staffDiv.className = 'chore-staff-member';

            const seniorBadge = staff.senior ? ' 🎓' : '';
            const groupColor = staff.group;

            staffDiv.innerHTML = `
                <span class="chore-staff-name">${staff.name}${seniorBadge}</span>
                <span class="chore-staff-group ${groupColor}-badge">${groupColor}</span>
            `;

            staffList.appendChild(staffDiv);
        });

        groupDiv.appendChild(staffList);
        container.appendChild(groupDiv);
    });
}

// Clear all data
function clearAll() {
    if (confirm('Are you sure you want to clear all staff data? This cannot be undone.')) {
        staffData = {
            red: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
            blue: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
            orange: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false})),
            green: Array(6).fill(null).map(() => ({name: '', lifeguard: false, senior: false}))
        };
        onBreakGroup = null;
        saveData();
        loadStaffIntoInputs();
        // Hide activity section
        document.getElementById('activitySection').style.display = 'none';
        // Hide chore section
        document.getElementById('choreSection').style.display = 'none';
    }
}
