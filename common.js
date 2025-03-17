// common.js - Shared utilities and data management

// Sample data for testing (based on your provided JSON and tips)
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
            "name": "Tom Vega",
            "route": "Alpha-1",
            "schedule": { "start": "2025-03-13T08:00:00", "end": "2025-03-13T16:00:00" },
            "location": "317 East Joshua Road",
            "department": "Supervisors"
        },
        {
            "name": "Alex Reed",
            "route": "Alpha-5",
            "schedule": { "start": "2025-03-13T09:00:00", "end": "2025-03-13T17:00:00" },
            "location": "294 Alhambra Dr",
            "department": "Officers"
        },
        {
            "name": "Bella Cruz",
            "route": "Alpha-4",
            "schedule": { "start": "2025-03-13T07:00:00", "end": "2025-03-13T15:00:00" },
            "location": "239 Zancudo Ave",
            "department": "Officers"
        },
        {
            "name": "dispatch1",
            "route": "N/A",
            "schedule": { "start": "2025-03-13T06:00:00", "end": "2025-03-13T18:00:00" },
            "location": "Dispatch HQ",
            "department": "Dispatchers"
        }
    ],
    propertiesData: [
        {"id": "PROP001", "propertyName": "Axel Apartments", "address": "123 Demo St, Austin, TX 78701", "apt": "Apt 4B", "minHits": 2, "notes": "Gated entry, security cameras", "suspended": false},
        {"id": "PROP002", "propertyName": "Briarwood Estates", "address": "456 Sample Rd, Austin, TX 78702", "apt": "", "minHits": 3, "notes": "Parking lot, frequent loitering", "suspended": false},
        {"id": "PROP003", "propertyName": "Cedar Heights", "address": "789 Test Ave, Austin, TX 78703", "apt": "Apt 2C", "minHits": 1, "notes": "Near park, high foot traffic", "suspended": false},
        {"id": "PROP004", "propertyName": "Driftwood Towers", "address": "101 Fake Ln, Austin, TX 78704", "apt": "Apt 3A", "minHits": 4, "notes": "Quiet area, staff on-site", "suspended": false},
        {"id": "PROP005", "propertyName": "Elmwood Place", "address": "555 Mock Blvd, Austin, TX 78705", "apt": "", "minHits": 2, "notes": "High traffic, vandalism reported", "suspended": false}
    ],
    dispatchData: [
        {"id": "D001", "dateTime": "2025-03-11T18:00:00Z", "caller": "Jane Doe", "property": "PROP001", "issue": "Noise Complaint", "status": "Pending", "assignedOfficer": ""},
        {"id": "D002", "dateTime": "2025-03-11T18:05:00Z", "caller": "John Smith", "property": "PROP002", "issue": "Suspicious Activity", "status": "Assigned", "assignedOfficer": "Officer Alex Reed"},
        {"id": "D003", "dateTime": "2025-03-11T18:10:00Z", "caller": "Property Manager", "property": "PROP003", "issue": "Trespass", "status": "In Progress", "assignedOfficer": "Officer Bella Cruz"},
        {"id": "D004", "dateTime": "2025-03-11T18:15:00Z", "caller": "Resident", "property": "PROP004", "issue": "Vehicle Break-In", "status": "Pending", "assignedOfficer": ""},
        {"id": "D005", "dateTime": "2025-03-11T17:45:00Z", "caller": "Security", "property": "PROP005", "issue": "Loitering", "status": "Completed", "assignedOfficer": "Officer Chris Dunn"}
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
        {"id": "P002", "name": "John Doe", "dob": "1985-03-22", "status": "Trespasser", "property": "PROP002", "behavior": "Hostile", "ctnStatus": "CTN Issued"},
        {"id": "P003", "name": "Alex Lee", "dob": "1995-11-10", "status": "Resident", "property": "PROP003", "behavior": "Unknown", "ctnStatus": "N/A"},
        {"id": "P004", "name": "Mike Brown", "dob": "1988-07-08", "status": "Staff", "property": "PROP004", "behavior": "Cautious", "ctnStatus": "VCTW"}
    ]
};

// Initialize global data
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
}

function loadData(callback) {
    console.log('loadData: Starting data load process...');
    // Load from localStorage or sample data
    window.usersData = JSON.parse(localStorage.getItem('users')) || sampleData.usersData;
    window.employeesData = JSON.parse(localStorage.getItem('employees')) || sampleData.employeesData;
    window.propertiesData = JSON.parse(localStorage.getItem('properties')) || sampleData.propertiesData;
    window.dispatchData = JSON.parse(localStorage.getItem('dispatches')) || sampleData.dispatchData;
    window.reportsData = JSON.parse(localStorage.getItem('reports')) || sampleData.reportsData;
    window.peopleData = JSON.parse(localStorage.getItem('people')) || sampleData.peopleData;
    
    saveDataToLocalStorage(); // Persist initial data
    console.log('loadData: Data loaded and saved');
    if (callback) callback();
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
        alert.className = `fixed bottom-4 right-4 ${color} text-white p-4 rounded shadow z-[1000]`;
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
