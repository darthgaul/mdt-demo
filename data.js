// data.js - Centralized data management

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

// ... (all CRUD functions unchanged: addUser, updateUser, etc.) ...

function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('reports', JSON.stringify(reportsData));
    localStorage.setItem('people', JSON.stringify(peopleData));
    localStorage.setItem('routes', JSON.stringify(routesData));
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
    deleteRoute,
    showAlert // Export showAlert for consistency (defined in common.js)
};
