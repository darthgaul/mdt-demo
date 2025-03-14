let employeesData = [];
let dispatchData = [];
let reportsData = [];
let propertiesData = [];
let peopleData = [];
let usersData = [];

async function loadData(callback) {
    try {
        const [employees, dispatch, reports, properties, people, users] = await Promise.all([
            fetch('employees.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load employees.json: ${res.status}`)),
            fetch('dispatch.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load dispatch.json: ${res.status}`)),
            fetch('reports.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load reports.json: ${res.status}`)),
            fetch('properties.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load properties.json: ${res.status}`)),
            fetch('people.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load people.json: ${res.status}`)),
            fetch('users.json').then(res => res.ok ? res.json() : Promise.reject(`Failed to load users.json: ${res.status}`))
        ]);
        employeesData = employees || [];
        dispatchData = dispatch || [];
        reportsData = reports || [];
        propertiesData = properties || [];
        peopleData = people || [];
        usersData = users || [];
        console.log('Data loaded:', { employeesData, dispatchData, reportsData, propertiesData, peopleData, usersData });
        if (callback) callback();
    } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to empty arrays to prevent rendering failures
        employeesData = [];
        dispatchData = [];
        reportsData = [];
        propertiesData = [];
        peopleData = [];
        usersData = [];
        if (callback) callback();
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
