// common.js - Shared utilities and data management

// Data arrays (loaded from local storage or initialized with defaults)
let usersData = JSON.parse(localStorage.getItem('users')) || [
    { username: 'JohnSmith', password: 'password123', group: 'Managers' },
    { username: 'AlexReed', password: 'password123', group: 'Officers' }
];
let employeesData = JSON.parse(localStorage.getItem('employees')) || [
    { name: 'JohnSmith', route: 'Route-1', schedule: { start: '2025-03-21T08:00:00Z', end: '2025-03-21T17:00:00Z' }, location: 'HQ', department: 'Supervisors', status: '10-8' },
    { name: 'AlexReed', route: 'Route-2', schedule: { start: '2025-03-21T08:00:00Z', end: '2025-03-21T17:00:00Z' }, location: 'Field', department: 'Officers', status: '10-8' }
];
let dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
let propertiesData = JSON.parse(localStorage.getItem('properties')) || [
    { id: 'PROP001', propertyName: 'Sunset Apartments', address: '123 Sunset Blvd', apt: '', minHits: 5, notes: 'High crime area', suspended: false },
    { id: 'PROP002', propertyName: 'Oakwood Plaza', address: '456 Oakwood Dr', apt: '', minHits: 3, notes: '', suspended: false }
];
let peopleData = JSON.parse(localStorage.getItem('people')) || [
    { id: 'P001', name: 'Jane Doe', dob: '1990-01-01', status: 'Trespasser', property: 'Sunset Apartments', behavior: 'Hostile', ctnStatus: 'CTN Issued' }
];
let reportsData = JSON.parse(localStorage.getItem('reports')) || [
    { caseNumber: '25-03140001', dateTime: '2025-03-21T10:00:00Z', personId: 'N/A', property: 'PROP001', type: 'Patrol Hit', narrative: 'Routine patrol', officer: 'AlexReed' }
];

function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('people', JSON.stringify(peopleData));
    localStorage.setItem('reports', JSON.stringify(reportsData));
}

function loadData(callback) {
    usersData = JSON.parse(localStorage.getItem('users')) || [
        { username: 'JohnSmith', password: 'password123', group: 'Managers' },
        { username: 'AlexReed', password: 'password123', group: 'Officers' }
    ];
    employeesData = JSON.parse(localStorage.getItem('employees')) || [
        { name: 'JohnSmith', route: 'Route-1', schedule: { start: '2025-03-21T08:00:00Z', end: '2025-03-21T17:00:00Z' }, location: 'HQ', department: 'Supervisors', status: '10-8' },
        { name: 'AlexReed', route: 'Route-2', schedule: { start: '2025-03-21T08:00:00Z', end: '2025-03-21T17:00:00Z' }, location: 'Field', department: 'Officers', status: '10-8' }
    ];
    dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
    propertiesData = JSON.parse(localStorage.getItem('properties')) || [
        { id: 'PROP001', propertyName: 'Sunset Apartments', address: '123 Sunset Blvd', apt: '', minHits: 5, notes: 'High crime area', suspended: false },
        { id: 'PROP002', propertyName: 'Oakwood Plaza', address: '456 Oakwood Dr', apt: '', minHits: 3, notes: '', suspended: false }
    ];
    peopleData = JSON.parse(localStorage.getItem('people')) || [
        { id: 'P001', name: 'Jane Doe', dob: '1990-01-01', status: 'Trespasser', property: 'Sunset Apartments', behavior: 'Hostile', ctnStatus: 'CTN Issued' }
    ];
    reportsData = JSON.parse(localStorage.getItem('reports')) || [
        { caseNumber: '25-03140001', dateTime: '2025-03-21T10:00:00Z', personId: 'N/A', property: 'PROP001', type: 'Patrol Hit', narrative: 'Routine patrol', officer: 'AlexReed' }
    ];
    if (callback) callback();
}

// Helper functions for properties
function addProperty(property) {
    propertiesData.push(property);
    saveDataToLocalStorage();
}

function updateProperty(id, updates) {
    const index = propertiesData.findIndex(p => p.id === id);
    if (index !== -1) {
        propertiesData[index] = { ...propertiesData[index], ...updates };
        saveDataToLocalStorage();
    }
}

function deleteProperty(id) {
    propertiesData = propertiesData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

// Helper functions for people
function addPerson(person) {
    peopleData.push(person);
    saveDataToLocalStorage();
}

function updatePerson(id, updates) {
    const index = peopleData.findIndex(p => p.id === id);
    if (index !== -1) {
        peopleData[index] = { ...peopleData[index], ...updates };
        saveDataToLocalStorage();
    }
}

function deletePerson(id) {
    peopleData = peopleData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

// Helper functions for reports
function addReport(report) {
    reportsData.push(report);
    saveDataToLocalStorage();
}

function updateReport(caseNumber, updates) {
    const index = reportsData.findIndex(r => r.caseNumber === caseNumber);
    if (index !== -1) {
        reportsData[index] = { ...reportsData[index], ...updates };
        saveDataToLocalStorage();
    }
}

function deleteReport(caseNumber) {
    reportsData = reportsData.filter(r => r.caseNumber !== caseNumber);
    saveDataToLocalStorage();
}

// Helper functions for users
function addUser(username, password, group) {
    usersData.push({ username, password, group });
    saveDataToLocalStorage();
}

function updateUser(username, password, group) {
    const index = usersData.findIndex(u => u.username === username);
    if (index !== -1) {
        usersData[index] = { ...usersData[index], password, group };
        saveDataToLocalStorage();
    }
}

function deleteUser(username) {
    usersData = usersData.filter(u => u.username !== username);
    saveDataToLocalStorage();
}

// Helper functions for employees
function addEmployee(employee) {
    employeesData.push(employee);
    saveDataToLocalStorage();
}

function updateEmployee(name, updates) {
    const index = employeesData.findIndex(e => e.name === name);
    if (index !== -1) {
        employeesData[index] = { ...employeesData[index], ...updates };
        saveDataToLocalStorage();
    }
}

function deleteEmployee(name) {
    employeesData = employeesData.filter(e => e.name !== name);
    saveDataToLocalStorage();
}

// Helper functions for dispatches
function updateDispatch(id, updates) {
    const index = dispatchData.findIndex(d => d.id === id);
    if (index !== -1) {
        dispatchData[index] = { ...dispatchData[index], ...updates };
        saveDataToLocalStorage();
    }
}

// Alert function
function showAlert(message, bgColor) {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `p-2 rounded ${bgColor} text-white`;
        alert.classList.remove('hidden');
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 3000);
    }
}

// Service worker setup
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Service worker message received:', event.data);
        if (event.ports && event.ports.length > 0) {
            try {
                event.ports[0].postMessage('ACK');
            } catch (err) {
                console.error('Failed to send ACK to service worker:', err);
            }
        }
    });

    navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker registered:', registration);
    }).catch((err) => {
        console.error('Service Worker registration failed:', err);
    });
}
