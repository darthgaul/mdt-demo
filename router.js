// router.js - Simple router for tab navigation

function navigateToTab(tab) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content area not found');
        return;
    }

    // Update browser history
    history.pushState({ tab }, '', `#${tab}`);

    // Route to the appropriate content
    switch (tab) {
        case 'dashboard':
            showDashboard();
            break;
        case 'dispatch':
            showDispatch();
            break;
        case 'properties':
            showProperties();
            break;
        case 'people':
            showPeople();
            break;
        case 'reports':
            showReports();
            break;
        case 'manager':
            showManager();
            break;
        default:
            showDashboard();
    }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    const tab = event.state?.tab || 'dashboard';
    navigateToTab(tab);
    const navLinks = document.querySelectorAll('.nav-tabs a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tab) {
            link.classList.add('active');
        }
    });
});

function showDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Overview: See your dispatches or team status. Route: Start your patrol route. Use the sidebar toggles on mobile.</p>
            <p>Example: Use 10-codes like "10-42" to mark yourself off duty.</p>
        </div>
        <div class="dashboard-container">
            <div class="sidebar" id="unitsSidebar">
                <button class="toggle-sidebar tooltip" onclick="toggleSidebar('unitsSidebar')">
                    Toggle Units
                    <span class="tooltip-text">Show/hide the Active Units sidebar</span>
                </button>
                <h3 class="text-lg font-semibold mb-2">Active Units</h3>
                <select id="unitFilter" class="bg-gray-700 text-white p-2 rounded w-full mb-2 tooltip" onchange="updateUnitsList()">
                    <option value="">All Departments</option>
                    <option value="Supervisors">Supervisors</option>
                    <option value="Dispatchers">Dispatchers</option>
                    <option value="Officers">Officers</option>
                    <span class="tooltip-text">Filter units by department</span>
                </select>
                <div id="unitsList"></div>
            </div>
            <div class="main-content">
                <div class="flex space-x-4 mb-4">
                    <button onclick="showDashboardTab('overview')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow tooltip">
                        Overview
                        <span class="tooltip-text">View team status and active dispatches</span>
                    </button>
                    <button onclick="showDashboardTab('route')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow tooltip">
                        Route
                        <span class="tooltip-text">Manage your assigned patrol route</span>
                    </button>
                </div>
                <div id="dashboardContent"></div>
                <div class="nato-cheat-sheet">
                    <h4 class="text-lg font-semibold mb-2">NATO Phonetic Cheat Sheet</h4>
                    <p>A - Alpha | B - Bravo | C - Charlie | D - Delta | E - Echo | F - Foxtrot | G - Golf | H - Hotel | I - India | J - Juliet | K - Kilo | L - Lima | M - Mike</p>
                    <p>N - November | O - Oscar | P - Papa | Q - Quebec | R - Romeo | S - Sierra | T - Tango | U - Uniform | V - Victor | W - Whiskey | X - Xray | Y - Yankee | Z - Zulu</p>
                </div>
            </div>
            <div class="sidebar" id="dispatchSidebar">
                <button class="toggle-sidebar tooltip" onclick="toggleSidebar('dispatchSidebar')">
                    Toggle Dispatches
                    <span class="tooltip-text">Show/hide the Active Dispatches sidebar</span>
                </button>
                <h3 class="text-lg font-semibold mb-2">Active Dispatches</h3>
                <div id="dispatchList"></div>
            </div>
        </div>
        <div id="alert" class="hidden"></div>
    `;
    // Reinitialize dashboard-specific logic
    initializeDashboard();
    // Load initial tab content
    showDashboardTab('overview');
    // Update units and dispatch lists after DOM is rendered
    setTimeout(() => {
        updateUnitsList();
        updateDispatchList();
    }, 0);
}

function showDashboardTab(tab) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.log('Index: User not logged in, redirecting to login.html');
        window.location.href = 'login.html';
        return;
    }

    const isManagerOrSupervisor = ['Managers', 'Supervisors'].includes(user.group);
    let html = '';

    if (tab === 'overview') {
        if (isManagerOrSupervisor) {
            const activeCalls = dispatchData.filter(d => d.status !== 'Completed').length;
            const loggedInOfficers = usersData.filter(u => employeesData.some(e => e.name === u.username && new Date() >= new Date(e.schedule.start) && new Date() <= new Date(e.schedule.end))).length;
            html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Active Calls:</strong> ${activeCalls}</p></div><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Officers Online:</strong> ${loggedInOfficers}</p></div></div>`;
            html += '<h3 class="text-lg font-semibold mb-2">Officer Status</h3><table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Route</th><th class="p-2 bg-gray-700">Start</th><th class="p-2 bg-gray-700">End</th><th class="p-2 bg-gray-700">Status</th></tr>';
            employeesData.forEach(emp => {
                const isOnline = usersData.some(u => u.username === emp.name);
                const statusColor = isOnline ? 'text-green-500' : 'text-red-500';
                html += `<tr><td class="p-2 ${statusColor}">${emp.name}</td><td class="p-2">${emp.route}</td><td class="p-2">${new Date(emp.schedule.start).toLocaleTimeString()}</td><td class="p-2">${new Date(emp.schedule.end).toLocaleTimeString()}</td><td class="p-2">${emp.status || 'Offline'}</td></tr>`;
            });
            html += '</table>';
            setInterval(checkDispatchTimeouts, 60000);
        } else {
            const active = dispatchData.filter(d => d.assignedOfficer === user.username && d.status !== 'Completed');
            console.log('Index: Active dispatches for user', user.username, ':', active);
            html += '<h3 class="text-lg font-semibold mb-2">Your Active Dispatches</h3>';
            html += active.length ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' : '<p class="text-center">No active dispatches assigned to you.</p>';
            active.forEach(disp => {
                const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                html += `<div class="bg-gray-700 p-3 rounded shadow"><p><strong>Issue:</strong> ${disp.issue}</p><p><strong>Property:</strong> ${disp.property}</p><p><strong>Status:</strong> <span class="${statusColor}">${disp.status}</span></p></div>`;
            });
            if (active.length) html += '</div>';
        }
    } else if (tab === 'route') {
        const officer = employeesData.find(e => e.name === user.username);
        const routeNum = officer ? parseInt(officer.route.split('-')[1]) : 5;
        const hitsPerOfficer = routeNum === 5 ? 40 : (routeNum === 4 ? 50 : 60);
        const activeProps = propertiesData.filter(p => !p.suspended);
        const propsPerOfficer = Math.ceil(activeProps.length / routeNum);
        const startIdx = employeesData.findIndex(e => e.name === user.username) * propsPerOfficer;
        const routeProps = activeProps.slice(startIdx, startIdx + propsPerOfficer);

        html += `<h3 class="text-lg font-semibold mb-2">Your Route: ${officer ? officer.route : 'Unassigned'} (${hitsPerOfficer} hits)</h3>`;
        html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Address</th><th class="p-2 bg-gray-700">Hits Done</th><th class="p-2 bg-gray-700">Actions</th></tr>';
        routeProps.forEach(prop => {
            const hitsDone = reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length;
            html += `<tr><td class="p-2">${prop.propertyName}</td><td class="p-2">${prop.address}</td><td class="p-2">${hitsDone}/${prop.minHits}</td><td class="p-2 space-x-2">`;
            html += `<button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow tooltip">
                Navigate
                <span class="tooltip-text">Open Google Maps to navigate to this property</span>
            </button>`;
            html += `<button onclick="arrive('${prop.id}')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow tooltip">
                Arrived
                <span class="tooltip-text">Mark arrival and log a patrol hit</span>
            </button>`;
            html += `</td></tr>`;
        });
        html += '</table>';
    }
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) {
        console.log('Index: Rendering dashboard content with HTML:', html);
        dashboardContent.innerHTML = html;
    } else {
        console.error('Index: dashboardContent element not found');
    }
}

function showDispatch() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Dispatch</h2>
        <div class="mb-4">
            <button onclick="showDispatchTab('active')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow mr-2">Active Dispatches</button>
            <button onclick="showDispatchTab('completed')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow mr-2">Completed Dispatches</button>
            <button onclick="showDispatchTab('new')" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">New Dispatch</button>
        </div>
        <div id="dispatchContent"></div>
    `;
    // Initialize dispatch tab (default to active dispatches)
    showDispatchTab('active');
}

function showDispatchTab(tab) {
    const dispatchContent = document.getElementById('dispatchContent');
    if (!dispatchContent) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const isOfficer = user.group === 'Officers';
    const isDispatcher = ['Dispatchers', 'Managers', 'Supervisors'].includes(user.group);
    let html = '';

    if (tab === 'active') {
        const activeDispatches = dispatchData ? dispatchData.filter(d => d.status !== 'Completed') : [];
        html += '<h3 class="text-lg font-semibold mb-2">Active Dispatches</h3>';
        if (activeDispatches.length) {
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th>' + (isDispatcher ? '<th class="p-2 bg-gray-700">Actions</th>' : '') + '</tr>';
            activeDispatches.forEach(disp => {
                if (!isOfficer || disp.assignedOfficer === user.username) {
                    const callTime = new Date(disp.dateTime).toLocaleString();
                    const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                    const statusColor = { Pending: 'yellow-500', Assigned: 'blue-500', 'In Progress': 'orange-500' }[disp.status];
                    html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2">${callTime}</td><td class="p-2">${assignedTime}</td>`;
                    if (isDispatcher) {
                        html += '<td class="p-2 space-x-2"><select onchange="assignOfficer(this, \'' + disp.id + '\')" class="bg-gray-700 text-white p-1 rounded">';
                        html += '<option value="">Assign</option>';
                        if (employeesData) {
                            employeesData.forEach(emp => {
                                html += '<option value="' + emp.name + '" ' + (disp.assignedOfficer === emp.name ? 'selected' : '') + '>' + emp.name + '</option>';
                            });
                        }
                        html += '</select><button onclick="clearDispatch(\'' + disp.id + '\')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Clear</button></td>';
                    }
                    html += '</tr>';
                }
            });
            html += '</table>';
        } else {
            html += '<p class="text-center">No active dispatches.</p>';
        }
    } else if (tab === 'completed') {
        const completedDispatches = dispatchData ? dispatchData.filter(d => d.status === 'Completed') : [];
        html += '<h3 class="text-lg font-semibold mb-2">Completed Dispatches</h3>';
        if (completedDispatches.length) {
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th><th class="p-2 bg-gray-700">Resolve Time</th>' + (isDispatcher ? '<th class="p-2 bg-gray-700">Actions</th>' : '') + '</tr>';
            completedDispatches.forEach(disp => {
                if (!isOfficer || disp.assignedOfficer === user.username) {
                    const callTime = new Date(disp.dateTime).toLocaleString();
                    const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                    const resolveTime = disp.resolveTime ? new Date(disp.resolveTime).toLocaleString() : 'N/A';
                    html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2">${callTime}</td><td class="p-2">${assignedTime}</td><td class="p-2">${resolveTime}</td>`;
                    if (isDispatcher) {
                        html += '<td class="p-2"><button onclick="restoreDispatch(\'' + disp.id + '\')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow">Restore</button></td>';
                    }
                    html += '</tr>';
                }
            });
            html += '</table>';
        } else {
            html += '<p class="text-center">No completed dispatches.</p>';
        }
    } else if (tab === 'new') {
        dispatchContent.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">New Dispatch</h3>
            <form id="newDispatchForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="issue">Issue</label>
                    <input type="text" id="issue" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter issue">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="property">Property</label>
                    <input type="text" id="property" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter property">
                </div>
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Create Dispatch</button>
            </form>
        `;
        const form = document.getElementById('newDispatchForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const issue = document.getElementById('issue').value;
                const property = document.getElementById('property').value;
                const newDispatch = {
                    id: `D${(dispatchData.length + 1).toString().padStart(3, '0')}`,
                    issue,
                    property,
                    status: 'Pending',
                    assignedOfficer: null,
                    dateTime: new Date().toISOString()
                };
                dispatchData.push(newDispatch);
                saveDataToLocalStorage();
                showAlert('Dispatch created successfully', 'bg-green-600');
                showDispatchTab('active');
            });
        }
    }
    dispatchContent.innerHTML = html;
}

function showProperties() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Properties</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter properties by name or address. Managers can add/edit properties.</p>
        </div>
        <div class="mb-4">
            <input type="text" id="propertySearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search properties..." onkeyup="filterProperties()">
        </div>
        <div id="propertyList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate properties
    filterProperties();
}

function filterProperties() {
    const search = document.getElementById('propertySearch')?.value.toLowerCase() || '';
    const properties = propertiesData.filter(p => 
        p.propertyName.toLowerCase().includes(search) || 
        p.address.toLowerCase().includes(search)
    );
    let html = '';
    properties.forEach(prop => {
        const reports = reportsData.filter(r => r.property === prop.id);
        html += `
            <div class="bg-gray-700 p-3 rounded shadow">
                <p><strong>${prop.propertyName}</strong></p>
                <p><strong>Address:</strong> ${prop.address}${prop.apt ? ', ' + prop.apt : ''}</p>
                <p><strong>Min Hits:</strong> ${prop.minHits}</p>
                <p><strong>Notes:</strong> ${prop.notes || 'N/A'}</p>
                <p><strong>Reports:</strong> ${reports.length}</p>
            </div>
        `;
    });
    const propertyList = document.getElementById('propertyList');
    if (propertyList) {
        propertyList.innerHTML = html || '<p class="text-center">No properties found.</p>';
    }
}

function showPeople() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">People</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter people by name or property. Click a person to view details (e.g., reports, CTN status). Managers can add/edit people.</p>
        </div>
        <div class="mb-4">
            <input type="text" id="peopleSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search people..." onkeyup="filterPeople()">
        </div>
        <div id="peopleList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate people
    filterPeople();
}

function filterPeople() {
    const search = document.getElementById('peopleSearch')?.value.toLowerCase() || '';
    const people = peopleData.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.property.toLowerCase().includes(search)
    );
    let html = '';
    people.forEach(person => {
        const behaviorClass = {
            Friendly: 'friendly-text',
            Cautious: 'cautious-text',
            Hostile: 'hostile-text',
            Unknown: 'unknown-text'
        }[person.behavior] || 'unknown-text';
        const ctnClass = person.ctnStatus === 'CTN Issued' ? 'ctn-active' : '';
        html += `
            <div class="bg-gray-700 p-3 rounded shadow ${ctnClass}">
                <p><strong class="name">${person.name}</strong></p>
                <p><strong>DOB:</strong> ${person.dob}</p>
                <p><strong>Status:</strong> ${person.status}</p>
                <p><strong>Property:</strong> ${person.property}</p>
                <p><strong>Behavior:</strong> <span class="${behaviorClass}">${person.behavior}</span></p>
                <p><strong>CTN Status:</strong> ${person.ctnStatus}</p>
            </div>
        `;
    });
    const peopleList = document.getElementById('peopleList');
    if (peopleList) {
        peopleList.innerHTML = html || '<p class="text-center">No people found.</p>';
    }
}

function showReports() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Reports</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter reports by case number, property, or type. Managers can add/edit reports.</p>
        </div>
        <div class="mb-4">
            <input type="text" id="reportSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search reports..." onkeyup="filterReports()">
        </div>
        <div id="reportList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate reports
    filterReports();
}

function filterReports() {
    const search = document.getElementById('reportSearch')?.value.toLowerCase() || '';
    const reports = reportsData.filter(r => 
        r.caseNumber.toLowerCase().includes(search) || 
        r.property.toLowerCase().includes(search) || 
        r.type.toLowerCase().includes(search)
    );
    let html = '';
    reports.forEach(report => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow">
                <p><strong>Case #:</strong> ${report.caseNumber}</p>
                <p><strong>Date:</strong> ${new Date(report.dateTime).toLocaleString()}</p>
                <p><strong>Property:</strong> ${report.property}</p>
                <p><strong>Type:</strong> ${report.type}</p>
                <p><strong>Narrative:</strong> ${report.narrative}</p>
                <p><strong>Officer:</strong> ${report.officer}</p>
            </div>
        `;
    });
    const reportList = document.getElementById('reportList');
    if (reportList) {
        reportList.innerHTML = html || '<p class="text-center">No reports found.</p>';
    }
}

function showManager() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Manager Dashboard</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Users: Add/edit/delete users. Employees: Manage employee schedules and routes. Properties: Add/edit properties.</p>
        </div>
        <div class="flex space-x-4 mb-4">
            <button onclick="showManagerTab('users')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Users</button>
            <button onclick="showManagerTab('employees')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Employees</button>
            <button onclick="showManagerTab('properties')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Properties</button>
        </div>
        <div id="managerContent"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Initialize manager tab (default to users)
    showManagerTab('users');
}

function showManagerTab(tab) {
    const managerContent = document.getElementById('managerContent');
    if (!managerContent) return;

    let html = '';

    if (tab === 'users') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Users</h3>';
        html += `
            <div class="mb-4">
                <input type="text" id="userSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search users..." onkeyup="filterUsers()">
            </div>
            <div id="userList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterUsers();
    } else if (tab === 'employees') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Employees</h3>';
        html += `
            <div class="mb-4">
                <input type="text" id="employeeSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search employees..." onkeyup="filterEmployees()">
            </div>
            <div id="employeeList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterEmployees();
    } else if (tab === 'properties') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Properties</h3>';
        html += `
            <div class="mb-4">
                <input type="text" id="propertySearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search properties..." onkeyup="filterProperties()">
            </div>
            <div id="propertyList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterProperties();
    }
}

function filterUsers() {
    const search = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const users = usersData.filter(u => u.username.toLowerCase().includes(search));
    let html = '';
    users.forEach(user => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow">
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Group:</strong> ${user.group}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="editUser('${user.username}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="deleteUser('${user.username}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
            </div>
        `;
    });
    const userList = document.getElementById('userList');
    if (userList) {
        userList.innerHTML = html || '<p class="text-center">No users found.</p>';
    }
}

function editUser(username) {
    const newPassword = prompt('Enter new password:', '');
    const newGroup = prompt('Enter new group (Managers, Supervisors, Officers, Dispatchers):', '');
    if (newPassword || newGroup) {
        updateUser(username, newPassword, newGroup);
        showAlert('User updated successfully', 'bg-green-600');
        filterUsers();
    }
}

function filterEmployees() {
    const search = document.getElementById('employeeSearch')?.value.toLowerCase() || '';
    const employees = employeesData.filter(e => e.name.toLowerCase().includes(search));
    let html = '';
    employees.forEach(emp => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow">
                <p><strong>Name:</strong> ${emp.name}</p>
                <p><strong>Route:</strong> ${emp.route}</p>
                <p><strong>Schedule:</strong> ${new Date(emp.schedule.start).toLocaleString()} - ${new Date(emp.schedule.end).toLocaleString()}</p>
                <p><strong>Location:</strong> ${emp.location}</p>
                <p><strong>Department:</strong> ${emp.department}</p>
                <p><strong>Status:</strong> ${emp.status}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="editEmployee('${emp.name}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="deleteEmployee('${emp.name}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
            </div>
        `;
    });
    const employeeList = document.getElementById('employeeList');
    if (employeeList) {
        employeeList.innerHTML = html || '<p class="text-center">No employees found.</p>';
    }
}

function editEmployee(name) {
    const newRoute = prompt('Enter new route:', '');
    const newLocation = prompt('Enter new location:', '');
    const newDepartment = prompt('Enter new department:', '');
    const newStatus = prompt('Enter new status (e.g., 10-8, 10-6, 10-42):', '');
    if (newRoute || newLocation || newDepartment || newStatus) {
        updateEmployee(name, { route: newRoute, location: newLocation, department: newDepartment, status: newStatus });
        showAlert('Employee updated successfully', 'bg-green-600');
        filterEmployees();
    }
}

function assignOfficer(select, dispatchId) {
    const officer = select.value;
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        updateDispatch(dispatchId, { assignedOfficer: officer || null, status: officer ? 'Assigned' : 'Pending', assignedTime: officer ? new Date().toISOString() : null });
        showDispatchTab('active');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}

function clearDispatch(dispatchId) {
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        updateDispatch(dispatchId, { status: 'Completed', resolveTime: new Date().toISOString() });
        showDispatchTab('active');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}

function restoreDispatch(dispatchId) {
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        updateDispatch(dispatchId, { status: 'Pending', resolveTime: null });
        showDispatchTab('completed');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}
