// common.js - Shared data and utility functions

// Existing data arrays (usersData, employeesData, propertiesData, etc.) remain unchanged unless specified

// Add routes data
let routesData = [
    { id: 'Route-1', name: 'North Patrol', propertyIds: ['PROP001', 'PROP002', 'PROP003'] },
    { id: 'Route-2', name: 'South Patrol', propertyIds: ['PROP004', 'PROP005', 'PROP006'] }
];

// Update employeesData to include officer type and assignments
let employeesData = [
    { name: 'JohnSmith', route: 'Route-1', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'HQ', department: 'Managers', status: '10-8', type: 'Patrol' },
    { name: 'BellaCruz', assignedProperty: 'PROP001', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'Sunset Plaza', department: 'Officers', status: '10-8', type: 'Static' },
    // Add 'type' and 'route' or 'assignedProperty' to other employees as needed
];

// Existing propertiesData (example)
let propertiesData = [
    { id: 'PROP001', propertyName: 'Sunset Plaza', address: '123 Sunset Blvd', minHits: 5, notes: 'High traffic', suspended: false },
    { id: 'PROP002', propertyName: 'Oakwood Apartments', address: '456 Oak St', minHits: 3, notes: 'Quiet area', suspended: false },
    { id: 'PROP003', propertyName: 'Downtown Mall', address: '789 Main St', minHits: 8, notes: 'Busy weekends', suspended: false },
    { id: 'PROP004', propertyName: 'Riverfront Park', address: '101 River Rd', minHits: 4, notes: 'Monitor vandalism', suspended: false },
    { id: 'PROP005', propertyName: 'Greenfield Warehouse', address: '202 Industrial Dr', minHits: 6, notes: 'Secure perimeter', suspended: false },
    { id: 'PROP006', propertyName: 'Lakeside Condos', address: '303 Lakeview Dr', minHits: 3, notes: 'Noise complaints', suspended: false }
];

// Add route management functions
function addRoute(route) {
    routesData.push(route);
    saveDataToLocalStorage();
}

function updateRoute(id, updates) {
    const route = routesData.find(r => r.id === id);
    if (route) {
        Object.assign(route, updates);
        saveDataToLocalStorage();
    }
}

function deleteRoute(id) {
    routesData = routesData.filter(r => r.id !== id);
    saveDataToLocalStorage();
}

// Update saveDataToLocalStorage to include routes
function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('routes', JSON.stringify(routesData));
    // Include other data arrays as needed
}

// Update loadData to include routes
function loadData(callback) {
    usersData = JSON.parse(localStorage.getItem('users')) || usersData;
    employeesData = JSON.parse(localStorage.getItem('employees')) || employeesData;
    propertiesData = JSON.parse(localStorage.getItem('properties')) || propertiesData;
    routesData = JSON.parse(localStorage.getItem('routes')) || routesData;
    if (callback) callback();
}
