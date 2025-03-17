// common.js - Shared utilities and data management

// Sample data for testing (from scripts.js)
const sampleData = {
    usersData: [
        { username: "JohnSmith", password: "john123", group: "Managers" },
        { username: "TomVega", password: "tom123", group: "Supervisors" },
        { username: "AlexReed", password: "alex123", group: "Officers" },
        { username: "BellaCruz", password: "bella123", group: "Officers" },
        { username: "SarahJones", password: "sarah123", group: "Dispatchers" }
    ],
    employeesData: JSON.parse(localStorage.getItem('employees')) || [], // Use your employees.json
    propertiesData: JSON.parse(localStorage.getItem('properties')) || [], // Use your properties.json
    dispatchData: JSON.parse(localStorage.getItem('dispatches')) || [], // Use your dispatch.json
    reportsData: JSON.parse(localStorage.getItem('reports')) || [], // Use your reports.json
    peopleData: JSON.parse(localStorage.getItem('people')) || [] // Use your people.json
};

// Initialize global data
window.usersData = JSON.parse(localStorage.getItem('users')) || sampleData.usersData;
window.employeesData = sampleData.employeesData;
window.propertiesData = sampleData.propertiesData;
window.dispatchData = sampleData.dispatchData;
window.reportsData = sampleData.reportsData;
window.peopleData = sampleData.peopleData;

// Save functions
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

// Utility functions (from scripts.js)
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

// Authentication (from scripts.js)
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.split('/').pop() !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Alert function (keep one version)
function showAlert(message, color = 'bg-green-600') {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `fixed bottom-4 right-4 ${color} text-white p-4 rounded shadow z-[1000]`;
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 3000);
    }
}

// Logout (from both files)
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Expose globals
window.loadData = loadData;
window.saveProperties = saveProperties;
window.saveReports = saveReports;
window.saveDispatch = saveDispatch;
window.calculateElapsed = calculateElapsed;
window.checkAuthentication = checkAuthentication;
window.showAlert = showAlert;
window.logout = logout;

<script>
    let isLoaded = false;

    document.addEventListener('DOMContentLoaded', () => {
        if (isLoaded) return;
        isLoaded = true;

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
        }
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    });

    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        loadData(() => {
            const user = usersData.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                showAlert('Invalid username or password', 'bg-red-600');
            }
        });
    }
</script>
