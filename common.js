// common.js - Shared data and utility functions

// Initial data arrays
let usersData = [
    { username: 'JohnSmith', password: 'john123', group: 'Managers' },
    { username: 'SarahJones', password: 'sarah123', group: 'Dispatchers' },
    { username: 'AlexReed', password: 'alex123', group: 'Officers' },
    { username: 'TomVega', password: 'tom123', group: 'Supervisors' },
    { username: 'BellaCruz', password: 'bella123', group: 'Officers' },
    { username: 'MikeBrown', password: 'mike123', group: 'Officers' },
    { username: 'LisaWhite', password: 'lisa123', group: 'Dispatchers' },
    { username: 'JamesGreen', password: 'james123', group: 'Officers' },
    { username: 'EmmaDavis', password: 'emma123', group: 'Supervisors' },
    { username: 'DavidLee', password: 'david123', group: 'Officers' }
];

let employeesData = [
    { name: 'JohnSmith', route: 'Route-1', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'HQ', department: 'Managers', status: '10-8', type: 'Patrol' },
    { name: 'SarahJones', route: '', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'Dispatch Center', department: 'Dispatchers', status: '10-8', type: '' },
    { name: 'AlexReed', route: 'Route-2', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'North Sector', department: 'Officers', status: '10-8', type: 'Patrol' },
    { name: 'TomVega', route: 'Route-3', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'South Sector', department: 'Supervisors', status: '10-8', type: 'Patrol' },
    { name: 'BellaCruz', assignedProperty: 'PROP001', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'Sunset Plaza', department: 'Officers', status: '10-8', type: 'Static' },
    { name: 'MikeBrown', route: 'Route-5', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'West Sector', department: 'Officers', status: '10-8', type: 'Patrol' },
    { name: 'LisaWhite', route: '', schedule: { start: '2025-03-21T08:00:00', end: '2025-03-21T16:00:00' }, location: 'Dispatch Center', department: 'Dispatchers', status: '10-8', type: '' },
    { name: 'JamesGreen', route: 'Route-1', schedule: { start: '2025-03-21T16:00:00', end: '2025-03-22T00:00:00' }, location: 'North Sector', department: 'Officers', status: '10-8', type: 'Patrol' },
    { name: 'EmmaDavis', route: 'Route-2', schedule: { start: '2025-03-21T16:00:00', end: '2025-03-22T00:00:00' }, location: 'South Sector', department: 'Supervisors', status: '10-8', type: 'Patrol' },
    { name: 'DavidLee', assignedProperty: 'PROP007', schedule: { start: '2025-03-21T16:00:00', end: '2025-03-22T00:00:00' }, location: 'City Library', department: 'Officers', status: '10-8', type: 'Static' }
];

let propertiesData = [
    { id: 'PROP001', propertyName: 'Sunset Plaza', address: '123 Sunset Blvd', apt: '', minHits: 5, notes: 'High traffic area', suspended: false },
    { id: 'PROP002', propertyName: 'Oakwood Apartments', address: '456 Oak St', apt: 'Apt 3B', minHits: 3, notes: 'Quiet residential', suspended: false },
    { id: 'PROP003', propertyName: 'Downtown Mall', address: '789 Main St', apt: '', minHits: 8, notes: 'Busy during weekends', suspended: false },
    { id: 'PROP004', propertyName: 'Riverfront Park', address: '101 River Rd', apt: '', minHits: 4, notes: 'Public park, monitor for vandalism', suspended: false },
    { id: 'PROP005', propertyName: 'Greenfield Warehouse', address: '202 Industrial Dr', apt: '', minHits: 6, notes: 'Secure perimeter', suspended: false },
    { id: 'PROP006', propertyName: 'Lakeside Condos', address: '303 Lakeview Dr', apt: 'Unit 12', minHits: 3, notes: 'Resident complaints about noise', suspended: false },
    { id: 'PROP007', propertyName: 'City Library', address: '404 Elm St', apt: '', minHits: 5, notes: 'Check for loitering after hours', suspended: false },
    { id: 'PROP008', propertyName: 'Westside Shopping Center', address: '505 West Ave', apt: '', minHits: 7, notes: 'High theft risk', suspended: false },
    { id: 'PROP009', propertyName: 'Pinewood Estates', address: '606 Pine Rd', apt: '', minHits: 4, notes: 'Gated community', suspended: false },
    { id: 'PROP010', propertyName: 'Harbor Office Park', address: '707 Harbor Blvd', apt: '', minHits: 6, notes: 'Corporate offices, secure entry', suspended: false }
];

let dispatchData = [
    {
        id: 'D001',
        issue: 'Suspicious Activity',
        property: 'Sunset Plaza',
        priority: 'High',
        notes: 'Reported at entrance',
        status: 'Pending',
        assignedOfficer: null,
        dateTime: '2025-03-21T09:00:00',
        assignmentHistory: []
    },
    {
        id: 'D002',
        issue: 'Noise Complaint',
        property: 'Oakwood Apartments',
        priority: 'Medium',
        notes: 'Loud music from Apt 3B',
        status: 'Assigned',
        assignedOfficer: 'AlexReed',
        dateTime: '2025-03-21T10:15:00',
        assignedTime: '2025-03-21T10:20:00',
        assignmentHistory: [
            { officer: 'AlexReed', timestamp: '2025-03-21T10:20:00' }
        ]
    },
    {
        id: 'D003',
        issue: 'Theft Reported',
        property: 'Downtown Mall',
        priority: 'High',
        notes: 'Shoplifting incident at store 12',
        status: 'In Progress',
        assignedOfficer: 'BellaCruz',
        dateTime: '2025-03-21T11:30:00',
        assignedTime: '2025-03-21T11:35:00',
        assignmentHistory: [
            { officer: 'BellaCruz', timestamp: '2025-03-21T11:35:00' }
        ]
    },
    {
        id: 'D004',
        issue: 'Vandalism',
        property: 'Riverfront Park',
        priority: 'Medium',
        notes: 'Graffiti on benches',
        status: 'Completed',
        assignedOfficer: 'MikeBrown',
        dateTime: '2025-03-21T08:45:00',
        assignedTime: '2025-03-21T08:50:00',
        resolveTime: '2025-03-21T09:30:00',
        assignmentHistory: [
            { officer: 'MikeBrown', timestamp: '2025-03-21T08:50:00' }
        ]
    },
    {
        id: 'D005',
        issue: 'Trespassing',
        property: 'Greenfield Warehouse',
        priority: 'High',
        notes: 'Unauthorized entry at gate 2',
        status: 'Assigned',
        assignedOfficer: 'JamesGreen',
        dateTime: '2025-03-21T12:00:00',
        assignedTime: '2025-03-21T12:05:00',
        assignmentHistory: [
            { officer: 'JamesGreen', timestamp: '2025-03-21T12:05:00' }
        ]
    },
    {
        id: 'D006',
        issue: 'Disturbance',
        property: 'Lakeside Condos',
        priority: 'Medium',
        notes: 'Argument in Unit 12',
        status: 'Pending',
        assignedOfficer: null,
        dateTime: '2025-03-21T13:20:00',
        assignmentHistory: []
    },
    {
        id: 'D007',
        issue: 'Loitering',
        property: 'City Library',
        priority: 'Low',
        notes: 'Group of teens after closing',
        status: 'In Progress',
        assignedOfficer: 'DavidLee',
        dateTime: '2025-03-21T14:00:00',
        assignedTime: '2025-03-21T14:05:00',
        assignmentHistory: [
            { officer: 'DavidLee', timestamp: '2025-03-21T14:05:00' }
        ]
    },
    {
        id: 'D008',
        issue: 'Shoplifting',
        property: 'Westside Shopping Center',
        priority: 'High',
        notes: 'Suspect fled on foot',
        status: 'Assigned',
        assignedOfficer: 'AlexReed',
        dateTime: '2025-03-21T15:10:00',
        assignedTime: '2025-03-21T15:15:00',
        assignmentHistory: [
            { officer: 'BellaCruz', timestamp: '2025-03-21T15:12:00' },
            { officer: 'AlexReed', timestamp: '2025-03-21T15:15:00' }
        ]
    },
    {
        id: 'D009',
        issue: 'Suspicious Vehicle',
        property: 'Pinewood Estates',
        priority: 'Medium',
        notes: 'Unfamiliar car parked near gate',
        status: 'Completed',
        assignedOfficer: 'MikeBrown',
        dateTime: '2025-03-21T09:00:00',
        assignedTime: '2025-03-21T09:05:00',
        resolveTime: '2025-03-21T09:45:00',
        assignmentHistory: [
            { officer: 'MikeBrown', timestamp: '2025-03-21T09:05:00' }
        ]
    },
    {
        id: 'D010',
        issue: 'Break-In Attempt',
        property: 'Harbor Office Park',
        priority: 'High',
        notes: 'Attempted entry at main entrance',
        status: 'In Progress',
        assignedOfficer: 'JamesGreen',
        dateTime: '2025-03-21T16:00:00',
        assignedTime: '2025-03-21T16:05:00',
        assignmentHistory: [
            { officer: 'JamesGreen', timestamp: '2025-03-21T16:05:00' }
        ]
    }
];

let reportsData = [
    { caseNumber: '25-0314001', dateTime: '2025-03-21T09:30:00', personId: 'N/A', property: 'PROP001', type: 'Patrol Hit', narrative: 'AlexReed arrived at property', officer: 'AlexReed' },
    { caseNumber: '25-0314002', dateTime: '2025-03-21T10:00:00', personId: 'N/A', property: 'PROP002', type: 'Incident', narrative: 'Noise complaint resolved', officer: 'BellaCruz' },
    { caseNumber: '25-0314003', dateTime: '2025-03-21T11:00:00', personId: 'N/A', property: 'PROP003', type: 'Patrol Hit', narrative: 'MikeBrown arrived at property', officer: 'MikeBrown' },
    { caseNumber: '25-0314004', dateTime: '2025-03-21T12:30:00', personId: 'N/A', property: 'PROP004', type: 'Incident', narrative: 'Vandalism reported, graffiti cleaned', officer: 'JamesGreen' },
    { caseNumber: '25-0314005', dateTime: '2025-03-21T13:00:00', personId: 'N/A', property: 'PROP005', type: 'Patrol Hit', narrative: 'DavidLee arrived at property', officer: 'DavidLee' },
    { caseNumber: '25-0314006', dateTime: '2025-03-21T14:00:00', personId: 'N/A', property: 'PROP006', type: 'Patrol Hit', narrative: 'AlexReed arrived at property', officer: 'AlexReed' },
    { caseNumber: '25-0314007', dateTime: '2025-03-21T15:00:00', personId: 'N/A', property: 'PROP007', type: 'Incident', narrative: 'Loitering group dispersed', officer: 'BellaCruz' },
    { caseNumber: '25-0314008', dateTime: '2025-03-21T16:00:00', personId: 'N/A', property: 'PROP008', type: 'Patrol Hit', narrative: 'MikeBrown arrived at property', officer: 'MikeBrown' },
    { caseNumber: '25-0314009', dateTime: '2025-03-21T09:45:00', personId: 'N/A', property: 'PROP009', type: 'Incident', narrative: 'Suspicious vehicle checked, all clear', officer: 'JamesGreen' },
    { caseNumber: '25-0314010', dateTime: '2025-03-21T16:30:00', personId: 'N/A', property: 'PROP010', type: 'Patrol Hit', narrative: 'DavidLee arrived at property', officer: 'DavidLee' }
];

let peopleData = [
    { id: 'P001', name: 'Jane Doe', dob: '1990-05-15', status: 'Staff', property: 'Sunset Plaza', behavior: 'Friendly', ctnStatus: 'N/A' },
    { id: 'P002', name: 'John Roe', dob: '1985-08-22', status: 'Trespasser', property: 'Oakwood Apartments', behavior: 'Hostile', ctnStatus: 'CTN Issued' }
];

let routesData = [
    { id: 'Route-1', name: 'North Patrol', propertyIds: ['PROP001', 'PROP002', 'PROP003'] },
    { id: 'Route-2', name: 'South Patrol', propertyIds: ['PROP004', 'PROP005', 'PROP006'] },
    { id: 'Route-3', name: 'East Patrol', propertyIds: ['PROP008', 'PROP009'] },
    { id: 'Route-5', name: 'West Patrol', propertyIds: ['PROP010'] }
];

// Utility functions for data management
function addUser(username, password, group) {
    usersData.push({ username, password, group });
    saveDataToLocalStorage();
}

function updateUser(username, newPassword, newGroup) {
    const user = usersData.find(u => u.username === username);
    if (user) {
        if (newPassword) user.password = newPassword;
        if (newGroup) user.group = newGroup;
        saveDataToLocalStorage();
    }
}

function deleteUser(username) {
    usersData = usersData.filter(u => u.username !== username);
    saveDataToLocalStorage();
}

function addEmployee(employee) {
    employeesData.push(employee);
    saveDataToLocalStorage();
}

function updateEmployee(name, updates) {
    const employee = employeesData.find(e => e.name === name);
    if (employee) {
        Object.assign(employee, updates);
        saveDataToLocalStorage();
    }
}

function deleteEmployee(name) {
    employeesData = employeesData.filter(e => e.name !== name);
    saveDataToLocalStorage();
}

function addProperty(property) {
    propertiesData.push(property);
    saveDataToLocalStorage();
}

function updateProperty(id, updates) {
    const property = propertiesData.find(p => p.id === id);
    if (property) {
        Object.assign(property, updates);
        saveDataToLocalStorage();
    }
}

function deleteProperty(id) {
    propertiesData = propertiesData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

function addPerson(person) {
    peopleData.push(person);
    saveDataToLocalStorage();
}

function updatePerson(id, updates) {
    const person = peopleData.find(p => p.id === id);
    if (person) {
        Object.assign(person, updates);
        saveDataToLocalStorage();
    }
}

function deletePerson(id) {
    peopleData = peopleData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

function addReport(report) {
    reportsData.push(report);
    saveDataToLocalStorage();
}

function updateReport(caseNumber, updates) {
    const report = reportsData.find(r => r.caseNumber === caseNumber);
    if (report) {
        Object.assign(report, updates);
        saveDataToLocalStorage();
    }
}

function deleteReport(caseNumber) {
    reportsData = reportsData.filter(r => r.caseNumber !== caseNumber);
    saveDataToLocalStorage();
}

function updateDispatch(id, updates) {
    const dispatch = dispatchData.find(d => d.id === id);
    if (dispatch) {
        Object.assign(dispatch, updates);
        saveDataToLocalStorage();
    }
}

function deleteDispatch(id) {
    dispatchData = dispatchData.filter(d => d.id !== id);
    saveDataToLocalStorage();
}

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

function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('reports', JSON.stringify(reportsData));
    localStorage.setItem('people', JSON.stringify(peopleData));
    localStorage.setItem('routes', JSON.stringify(routesData));
}

function loadData(callback) {
    usersData = JSON.parse(localStorage.getItem('users')) || usersData;
    employeesData = JSON.parse(localStorage.getItem('employees')) || employeesData;
    dispatchData = JSON.parse(localStorage.getItem('dispatches')) || dispatchData;
    propertiesData = JSON.parse(localStorage.getItem('properties')) || propertiesData;
    reportsData = JSON.parse(localStorage.getItem('reports')) || reportsData;
    peopleData = JSON.parse(localStorage.getItem('people')) || peopleData;
    routesData = JSON.parse(localStorage.getItem('routes')) || routesData;
    if (callback) callback();
}

function showAlert(message, bgColor) {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `fixed bottom-4 right-4 p-4 rounded shadow ${bgColor} text-white`;
        alert.classList.remove('hidden');
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 3000);
    }
}
