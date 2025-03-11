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

        const storedDispatch = JSON.parse(localStorage.getItem('dispatchData') || '[]');
        if (storedDispatch.length) dispatchData = storedDispatch;

        const storedProperties = JSON.parse(localStorage.getItem('customProperties') || '[]');
        storedProperties.forEach(prop => {
            if (!propertiesData.some(p => p.id === prop.id)) propertiesData.push(prop);
        });

        const storedReports = JSON.parse(localStorage.getItem('reportsData') || '[]');
        if (storedReports.length) reportsData = storedReports;

        if (callback) callback();
    }).catch(err => console.error('Promise.all error:', err));
}

function saveDispatch() {
    localStorage.setItem('dispatchData', JSON.stringify(dispatchData));
}

function saveReports() {
    localStorage.setItem('reportsData', JSON.stringify(reportsData));
}

function calculateElapsed(dateTime) {
    const now = new Date();
    const callTime = new Date(dateTime);
    const diffMs = now - callTime;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return { minutes, seconds, totalMs: diffMs };
}
