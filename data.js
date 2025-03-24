// data.js - Centralized data management
let usersData = [];
let employeesData = [];
let dispatchData = [];
let propertiesData = [];
let reportsData = [];
let peopleData = [];
let routesData = [];

// Seed default data if localStorage is empty
function seedData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { username: 'JohnSmith', password: 'john123', group: 'Managers' },
            { username: 'SarahJones', password: 'sarah123', group: 'Dispatchers' },
            { username: 'AlexReed', password: 'alex123', group: 'Officers' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('employees')) {
        const defaultEmployees = [
            { name: 'JohnSmith', route: 'Route-1', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'HQ', department: 'Managers', status: '10-8', type: 'Patrol' },
            { name: 'SarahJones', route: '', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'Dispatch Center', department: 'Dispatchers', status: '10-8', type: '' },
            { name: 'AlexReed', route: 'Route-2', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'North Sector', department: 'Officers', status: '10-8', type: 'Patrol' }
        ];
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
    }
    // Add more seeding for propertiesData, routesData, etc., as needed
}

// Load data from localStorage
function loadData(callback) {
    seedData();
    usersData = JSON.parse(localStorage.getItem('users')) || [];
    employeesData = JSON.parse(localStorage.getItem('employees')) || [];
    dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
    propertiesData = JSON.parse(localStorage.getItem('properties')) || [];
    reportsData = JSON.parse(localStorage.getItem('reports')) || [];
    peopleData = JSON.parse(localStorage.getItem('people')) || [];
    routesData = JSON.parse(localStorage.getItem('routes')) || [];
    if (callback) callback();
}

// Expose globals for non-module scripts
window.usersData = usersData;
window.employeesData = employeesData;
window.loadData = loadData;

export { usersData, employeesData, loadData }; // For module scripts
