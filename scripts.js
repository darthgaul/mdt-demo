let employeesData = [];
let dispatchData = [];
let reportsData = [];
let propertiesData = [];
let peopleData = [];
let usersData = [];

async function loadData(callback) {
    try {
        const [employees, dispatch, reports, properties, people, users] = await Promise.all([
            fetch('employees.json').then(res => res.json()),
            fetch('dispatch.json').then(res => res.json()),
            fetch('reports.json').then(res => res.json()),
            fetch('properties.json').then(res => res.json()),
            fetch('people.json').then(res => res.json()),
            fetch('users.json').then(res => res.json())
        ]);
        employeesData = employees;
        dispatchData = dispatch;
        reportsData = reports;
        propertiesData = properties;
        peopleData = people;
        usersData = users;
        console.log('Data loaded:', { employeesData, dispatchData, reportsData, propertiesData, peopleData, usersData });
        if (callback) callback();
    } catch (error) {
        console.error('Promise.all error:', error);
    }
}

function saveDispatch() {
    localStorage.setItem('dispatch', JSON.stringify(dispatchData));
}

function saveReports() {
    localStorage.setItem('reports', JSON.stringify(reportsData));
}

function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(propertiesData));
}

function calculateElapsed(dateTime) {
    const start = new Date(dateTime);
    const now = new Date();
    const diff = now - start;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    return { hours, minutes: minutes % 60 };
}
