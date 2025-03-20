// common.js - Shared utilities and data management

// Data arrays (loaded from local storage or initialized)
let usersData = JSON.parse(localStorage.getItem('users')) || [];
let employeesData = JSON.parse(localStorage.getItem('employees')) || [];
let dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
let propertiesData = JSON.parse(localStorage.getItem('properties')) || [];
let peopleData = JSON.parse(localStorage.getItem('people')) || [];
let reportsData = JSON.parse(localStorage.getItem('reports')) || [];

function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('people', JSON.stringify(peopleData));
    localStorage.setItem('reports', JSON.stringify(reportsData));
}

function loadData(callback) {
    usersData = JSON.parse(localStorage.getItem('users')) || [];
    employeesData = JSON.parse(localStorage.getItem('employees')) || [];
    dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
    propertiesData = JSON.parse(localStorage.getItem('properties')) || [];
    peopleData = JSON.parse(localStorage.getItem('people')) || [];
    reportsData = JSON.parse(localStorage.getItem('reports')) || [];
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

// Helper functions for dispatches (already used in dispatch tab)
function updateDispatch(id, updates) {
    const index = dispatchData.findIndex(d => d.id === id);
    if (index !== -1) {
        dispatchData[index] = { ...dispatchData[index], ...updates };
        saveDataToLocalStorage();
    }
}

// Alert function (already used throughout the app)
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

// Service worker setup (already present, unchanged)
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
