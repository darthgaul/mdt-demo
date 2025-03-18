// common.js - Shared utilities and data management

// Sample data for initial setup
const sampleData = {
    usersData: [
        { username: "JohnSmith", password: "john123", group: "Managers" },
        { username: "TomVega", password: "tom123", group: "Supervisors" },
        { username: "AlexReed", password: "alex123", group: "Officers" },
        { username: "BellaCruz", password: "bella123", group: "Officers" },
        { username: "SarahJones", password: "sarah123", group: "Dispatchers" }
    ],
    employeesData: [
        {
            "name": "TomVega",
            "route": "Alpha-1",
            "schedule": { "start": "2025-03-13T08:00:00", "end": "2025-03-13T16:00:00" },
            "location": "317 East Joshua Road",
            "department": "Supervisors",
            "status": "10-8" // Initial status
        },
        {
            "name": "AlexReed",
            "route": "Alpha-5",
            "schedule": { "start": "2025-03-13T09:00:00", "end": "2025-03-13T17:00:00" },
            "location": "294 Alhambra Dr",
            "department": "Officers",
            "status": "10-8" // Initial status
        },
        {
            "name": "BellaCruz",
            "route": "Alpha-4",
            "schedule": { "start": "2025-03-13T07:00:00", "end": "2025-03-13T15:00:00" },
            "location": "239 Zancudo Ave",
            "department": "Officers",
            "status": "10-8" // Initial status
        },
        {
            "name": "SarahJones",
            "route": "N/A",
            "schedule": { "start": "2025-03-13T06:00:00", "end": "2025-03-13T18:00:00" },
            "location": "Dispatch HQ",
            "department": "Dispatchers",
            "status": "10-8" // Initial status
        }
    ],
    propertiesData: [
        {"id": "PROP001", "propertyName": "Axel Apartments", "address": "123 Demo St, Austin, TX 78701", "apt": "Apt 4B", "minHits": 2, "notes": "Gated entry, security cameras", "suspended": false},
        {"id": "PROP002", "propertyName": "Briarwood Estates", "address": "456 Sample Rd, Austin, TX 78702", "apt": "", "minHits": 3, "notes": "Parking lot, frequent loitering", "suspended": false}
    ],
    dispatchData: [
        {"id": "D001", "dateTime": "2025-03-11T18:00:00Z", "caller": "Jane Doe", "property": "PROP001", "issue": "Noise Complaint", "status": "Assigned", "assignedOfficer": "TomVega", "assignedTime": "2025-03-11T18:02:00Z"},
        {"id": "D002", "dateTime": "2025-03-11T18:05:00Z", "caller": "John Smith", "property": "PROP002", "issue": "Suspicious Activity", "status": "Assigned", "assignedOfficer": "AlexReed", "assignedTime": "2025-03-11T18:06:00Z"},
        {"id": "D003", "dateTime": "2025-03-11T18:10:00Z", "caller": "Property Manager", "property": "PROP001", "issue": "Trespass", "status": "Assigned", "assignedOfficer": "BellaCruz", "assignedTime": "2025-03-11T18:12:00Z"}
    ],
    reportsData: [
        {
            "caseNumber": "25-03141030",
            "dateTime": "2025-03-14T10:30:00.000Z",
            "personId": "P001",
            "property": "PROP001",
            "type": "Patrol Hit",
            "narrative": "JohnSmith: Patrol hit completed at Axel Apartments.",
            "officer": "JohnSmith"
        },
        {
            "caseNumber": "25-03141100",
            "dateTime": "2025-03-14T11:00:00.000Z",
            "personId": "N/A",
            "property": "PROP002",
            "type": "Incident",
            "narrative": "TomVega: Suspicious activity reported at Beta Building.",
            "officer": "TomVega"
        }
    ],
    peopleData: [
        {"id": "P001", "name": "Jane Smith", "dob": "1990-01-15", "status": "Staff", "property": "PROP001", "behavior": "Friendly", "ctnStatus": "N/A"},
        {"id": "P002", "name": "John Doe", "dob": "1985-03-22", "status": "Trespasser", "property": "PROP002", "behavior": "Hostile", "ctnStatus": "CTN Issued"}
    ]
};

// Initialize global data from localStorage or sample data
window.usersData = JSON.parse(localStorage.getItem('users')) || sampleData.usersData;
window.employeesData = JSON.parse(localStorage.getItem('employees')) || sampleData.employeesData;
window.propertiesData = JSON.parse(localStorage.getItem('properties')) || sampleData.propertiesData;
window.dispatchData = JSON.parse(localStorage.getItem('dispatches')) || sampleData.dispatchData;
window.reportsData = JSON.parse(localStorage.getItem('reports')) || sampleData.reportsData;
window.peopleData = JSON.parse(localStorage.getItem('people')) || sampleData.peopleData;

// Data management functions
function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(window.usersData));
    localStorage.setItem('employees', JSON.stringify(window.employeesData));
    localStorage.setItem('properties', JSON.stringify(window.propertiesData));
    localStorage.setItem('dispatches', JSON.stringify(window.dispatchData));
    localStorage.setItem('reports', JSON.stringify(window.reportsData));
    localStorage.setItem('people', JSON.stringify(window.peopleData));
    console.log('saveDataToLocalStorage: Data saved to localStorage');
}

function loadData(callback) {
    console.log('loadData: Starting data load process...');
    try {
        window.usersData = JSON.parse(localStorage.getItem('users')) || sampleData.usersData;
        window.employeesData = JSON.parse(localStorage.getItem('employees')) || sampleData.employeesData;
        window.propertiesData = JSON.parse(localStorage.getItem('properties')) || sampleData.propertiesData;
        window.dispatchData = JSON.parse(localStorage.getItem('dispatches')) || sampleData.dispatchData;
        window.reportsData = JSON.parse(localStorage.getItem('reports')) || sampleData.reportsData;
        window.peopleData = JSON.parse(localStorage.getItem('people')) || sampleData.peopleData;
        
        saveDataToLocalStorage(); // Persist initial data
        console.log('loadData: Data loaded and saved');
        console.log('loadData: dispatchData after load:', window.dispatchData);
        if (callback) callback();
    } catch (error) {
        console.error('loadData: Error loading data:', error);
    }
}

// Utility functions for data manipulation
function addUser(username, password, group) {
    const user = { username, password, group };
    window.usersData.push(user);
    saveDataToLocalStorage();
}

function updateUser(username, newPassword, newGroup) {
    const user = window.usersData.find(u => u.username === username);
    if (user) {
        user.password = newPassword || user.password;
        user.group = newGroup || user.group;
        saveDataToLocalStorage();
    }
}

function deleteUser(username) {
    window.usersData = window.usersData.filter(u => u.username !== username);
    saveDataToLocalStorage();
}

function addEmployee(employee) {
    window.employeesData.push(employee);
    saveDataToLocalStorage();
}

function updateEmployee(name, updates) {
    const employee = window.employeesData.find(e => e.name === name);
    if (employee) {
        Object.assign(employee, updates);
        saveDataToLocalStorage();
        console.log('updateEmployee: Status updated for', name, 'to', updates.status);
    }
}

function deleteEmployee(name) {
    window.employeesData = window.employeesData.filter(e => e.name !== name);
    saveDataToLocalStorage();
}

function addProperty(property) {
    window.propertiesData.push(property);
    saveDataToLocalStorage();
}

function updateProperty(id, updates) {
    const property = window.propertiesData.find(p => p.id === id);
    if (property) {
        Object.assign(property, updates);
        saveDataToLocalStorage();
    }
}

function deleteProperty(id) {
    window.propertiesData = window.propertiesData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

function addDispatch(dispatch) {
    window.dispatchData.push(dispatch);
    saveDataToLocalStorage();
}

function updateDispatch(id, updates) {
    const dispatch = window.dispatchData.find(d => d.id === id);
    if (dispatch) {
        Object.assign(dispatch, updates);
        saveDataToLocalStorage();
    }
}

function deleteDispatch(id) {
    window.dispatchData = window.dispatchData.filter(d => d.id !== id);
    saveDataToLocalStorage();
}

function addReport(report) {
    window.reportsData.push(report);
    saveDataToLocalStorage();
}

function updateReport(caseNumber, updates) {
    const report = window.reportsData.find(r => r.caseNumber === caseNumber);
    if (report) {
        Object.assign(report, updates);
        saveDataToLocalStorage();
    }
}

function deleteReport(caseNumber) {
    window.reportsData = window.reportsData.filter(r => r.caseNumber !== caseNumber);
    saveDataToLocalStorage();
}

function addPerson(person) {
    window.peopleData.push(person);
    saveDataToLocalStorage();
}

function updatePerson(id, updates) {
    const person = window.peopleData.find(p => p.id === id);
    if (person) {
        Object.assign(person, updates);
        saveDataToLocalStorage();
    }
}

function deletePerson(id) {
    window.peopleData = window.peopleData.filter(p => p.id !== id);
    saveDataToLocalStorage();
}

// Utility functions
function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(window.propertiesData));
}

function saveReports() {
    localStorage.setItem('reports', JSON.stringify(window.reportsData));
}

function saveDispatch() {
    localStorage.setItem('dispatches', JSON.stringify(window.dispatchData));
}

function calculateElapsed(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const minutes = Math.floor(diffMs / 1000 / 60);
    return { minutes };
}

// Authentication
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.split('/').pop() !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Alert function
function showAlert(message, color = 'bg-green-600') {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `fixed bottom-4 right-4 ${color} text-white p-2 rounded shadow z-[1000]`;
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 3000);
    }
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Expose globals and functions
window.loadData = loadData;
window.saveProperties = saveProperties;
window.saveReports = saveReports;
window.saveDispatch = saveDispatch;
window.calculateElapsed = calculateElapsed;
window.checkAuthentication = checkAuthentication;
window.showAlert = showAlert;
window.logout = logout;
window.addUser = addUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.addEmployee = addEmployee;
window.updateEmployee = updateEmployee;
window.deleteEmployee = deleteEmployee;
window.addProperty = addProperty;
window.updateProperty = updateProperty;
window.deleteProperty = deleteProperty;
window.addDispatch = addDispatch;
window.updateDispatch = updateDispatch;
window.deleteDispatch = deleteDispatch;
window.addReport = addReport;
window.updateReport = updateReport;
window.deleteReport = deleteReport;
window.addPerson = addPerson;
window.updatePerson = updatePerson;
window.deletePerson = deletePerson;
