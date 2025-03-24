// data.js - Centralized data management

// Data arrays (initially empty, populated by loadData)
let usersData = [];
let employeesData = [];
let dispatchData = [];
let propertiesData = [];
let reportsData = [];
let peopleData = [];
let routesData = [];

function loadData(callback) {
    usersData = JSON.parse(localStorage.getItem('users')) || [];
    employeesData = JSON.parse(localStorage.getItem('employees')) || [];
    dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
    propertiesData = JSON.parse(localStorage.getItem('properties')) || [];
    reportsData = JSON.parse(localStorage.getItem('reports')) || [];
    peopleData = JSON.parse(localStorage.getItem('people')) || [];
    routesData = JSON.parse(localStorage.getItem('routes')) || [];
    if (callback) callback();
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

// Expose globals for non-module scripts
window.usersData = usersData;
window.employeesData = employeesData;
window.dispatchData = dispatchData;
window.propertiesData = propertiesData;
window.reportsData = reportsData;
window.peopleData = peopleData;
window.routesData = routesData;
window.loadData = loadData;
window.saveDataToLocalStorage = saveDataToLocalStorage;
window.addUser = addUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.addEmployee = addEmployee;
window.updateEmployee = updateEmployee;
window.deleteEmployee = deleteEmployee;
window.addProperty = addProperty;
window.updateProperty = updateProperty;
window.deleteProperty = deleteProperty;
window.addPerson = addPerson;
window.updatePerson = updatePerson;
window.deletePerson = deletePerson;
window.addReport = addReport;
window.updateReport = updateReport;
window.deleteReport = deleteReport;
window.updateDispatch = updateDispatch;
window.deleteDispatch = deleteDispatch;
window.addRoute = addRoute;
window.updateRoute = updateRoute;
window.deleteRoute = deleteRoute;

// Export for module scripts
export {
    usersData,
    employeesData,
    dispatchData,
    propertiesData,
    reportsData,
    peopleData,
    routesData,
    loadData,
    saveDataToLocalStorage,
    addUser,
    updateUser,
    deleteUser,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProperty,
    updateProperty,
    deleteProperty,
    addPerson,
    updatePerson,
    deletePerson,
    addReport,
    updateReport,
    deleteReport,
    updateDispatch,
    deleteDispatch,
    addRoute,
    updateRoute,
    deleteRoute
};
