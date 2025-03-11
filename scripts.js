let peopleData = [], propertiesData = [], dispatchData = [], reportsData = [], usersData = [], employeesData = [];

function loadData(callback) {
    Promise.all([
        fetch('people.json').then(res => res.ok ? res.json() : []),
        fetch('properties.json').then(res => res.ok ? res.json() : []),
        fetch('dispatch.json').then(res => res.ok ? res.json() : []),
        fetch('reports.json').then(res => res.ok ? res.json() : []),
        fetch('users.json').then(res => res.ok ? res.json() : []),
        fetch('employees.json').then(res => res.ok ? res.json() : [])
    ]).then(([people, properties, dispatch, reports, users, employees]) => {
        console.log('Data loaded:', { people, properties, dispatch, reports, users, employees });
        peopleData = people || [];
        propertiesData = properties || [];
        dispatchData = dispatch || [];
        reportsData = reports || [];
        usersData = users || [];
        employeesData = employees || [];

        // Load persisted dispatch from localStorage
        const storedDispatch = JSON.parse(localStorage.getItem('dispatchData') || '[]');
        if (storedDispatch.length) dispatchData = storedDispatch;

        if (callback) callback();
    }).catch(err => console.error('Promise.all error:', err));
}

function saveDispatch() {
    localStorage.setItem('dispatchData', JSON.stringify(dispatchData));
}
