// router.js - Simple router for tab navigation

function navigateToTab(tab) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content area not found');
        return;
    }

    // Add fade-out effect
    mainContent.style.opacity = '0';

    // Update browser history
    history.pushState({ tab }, '', `#${tab}`);

    // Delay content update to allow fade-out transition
    setTimeout(() => {
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
        // Fade-in the new content
        mainContent.style.opacity = '1';
    }, 300); // Match the transition duration in CSS
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.log('Index: User not logged in, redirecting to login.html');
        window.location.href = 'login.html';
        return;
    }

    const isDispatcher = user.group === 'Dispatchers';
    const isManagerOrSupervisor = ['Managers', 'Supervisors'].includes(user.group);
    const isOfficer = user.group === 'Officers';

    mainContent.innerHTML = `
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Overview: See your dispatches or team status. ${isOfficer ? 'Route: Start your patrol route.' : ''} Use the sidebar toggles on mobile.</p>
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
                    ${!isDispatcher ? `
                    <button onclick="showDashboardTab('route')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow tooltip">
                        Route
                        <span class="tooltip-text">Manage patrol routes</span>
                    </button>
                    ` : ''}
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

    const isDispatcher = user.group === 'Dispatchers';
    const isManagerOrSupervisor = ['Managers', 'Supervisors'].includes(user.group);
    const isOfficer = user.group === 'Officers';
    let html = '';

    if (tab === 'overview') {
        if (isDispatcher) {
            // Dispatchers: Dispatch-focused dashboard
            html += '<h3 class="text-lg font-semibold mb-2">Active Dispatches</h3>';
            let activeDispatches = dispatchData ? dispatchData.filter(d => d.status !== 'Completed') : [];
            if (activeDispatches.length) {
                html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Priority</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th><th class="p-2 bg-gray-700">Assignment History</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                activeDispatches.forEach(disp => {
                    const callTime = new Date(disp.dateTime).toLocaleString();
                    const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                    const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                    const history = disp.assignmentHistory ? disp.assignmentHistory.map(h => `${h.officer} at ${new Date(h.timestamp).toLocaleString()}`).join('<br>') : 'N/A';
                    html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.priority}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2"><span class="${statusColor}">${disp.status}</span></td><td class="p-2">${callTime}</td><td class="p-2">${assignedTime}</td><td class="p-2">${history}</td>`;
                    html += '<td class="p-2 space-x-2">';
                    html += `<select onchange="assignOfficer(this, '${disp.id}')" class="bg-gray-700 text-white p-1 rounded">`;
                    html += '<option value="">Assign</option>';
                    if (employeesData) {
                        employeesData.forEach(emp => {
                            html += `<option value="${emp.name}" ${disp.assignedOfficer === emp.name ? 'selected' : ''}>${emp.name}</option>`;
                        });
                    }
                    html += '</select>';
                    html += `<button onclick="editDispatch('${disp.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>`;
                    html += `<button onclick="clearDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Clear</button>`;
                    html += `<button onclick="confirmDeleteDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>`;
                    html += '</td></tr>';
                });
                html += '</table>';
            } else {
                html += '<p class="text-center">No active dispatches.</p>';
            }
        } else if (isManagerOrSupervisor) {
            // Managers/Supervisors: Managerial-oriented dashboard
            const activeCalls = dispatchData.filter(d => d.status !== 'Completed').length;
            const loggedInOfficers = usersData.filter(u => employeesData.some(e => e.name === u.username && new Date() >= new Date(e.schedule.start) && new Date() <= new Date(e.schedule.end))).length;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const completedToday = dispatchData.filter(d => d.status === 'Completed' && new Date(d.resolveTime) >= today).length;
            const overdueDispatches = dispatchData.filter(d => {
                const elapsed = (new Date() - new Date(d.dateTime)) / 1000 / 60;
                return d.status !== 'Completed' && elapsed >= 15;
            }).length;

            html += `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="bg-gray-700 p-3 rounded shadow"><p><strong>Active Calls:</strong> ${activeCalls}</p></div>
                    <div class="bg-gray-700 p-3 rounded shadow"><p><strong>Officers Online:</strong> ${loggedInOfficers}</p></div>
                    <div class="bg-gray-700 p-3 rounded shadow"><p><strong>Completed Today:</strong> ${completedToday}</p></div>
                    <div class="bg-gray-700 p-3 rounded shadow"><p><strong>Overdue Dispatches:</strong> ${overdueDispatches}</p></div>
                </div>
            `;

            // Officer Status Table
            html += '<h3 class="text-lg font-semibold mb-2">Officer Status</h3>';
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Route</th><th class="p-2 bg-gray-700">Start</th><th class="p-2 bg-gray-700">End</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Active Dispatches</th></tr>';
            employeesData.forEach(emp => {
                const isOnline = usersData.some(u => u.username === emp.name);
                const statusColor = isOnline ? 'text-green-500' : 'text-red-500';
                const activeDispatches = dispatchData.filter(d => d.assignedOfficer === emp.name && d.status !== 'Completed').length;
                html += `<tr><td class="p-2 ${statusColor}">${emp.name}</td><td class="p-2">${emp.route}</td><td class="p-2">${new Date(emp.schedule.start).toLocaleTimeString()}</td><td class="p-2">${new Date(emp.schedule.end).toLocaleTimeString()}</td><td class="p-2">${emp.status || 'Offline'}</td><td class="p-2">${activeDispatches}</td></tr>`;
            });
            html += '</table>';

            // Mini Active Dispatches Table
            html += '<h3 class="text-lg font-semibold mb-2 mt-4">Active Dispatches</h3>';
            let activeDispatches = dispatchData ? dispatchData.filter(d => d.status !== 'Completed') : [];
            if (activeDispatches.length) {
                html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Priority</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                activeDispatches.forEach(disp => {
                    const callTime = new Date(disp.dateTime).toLocaleString();
                    const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                    const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                    html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.priority}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2"><span class="${statusColor}">${disp.status}</span></td>`;
                    html += '<td class="p-2 space-x-2">';
                    html += `<select onchange="assignOfficer(this, '${disp.id}')" class="bg-gray-700 text-white p-1 rounded">`;
                    html += '<option value="">Assign</option>';
                    if (employeesData) {
                        employeesData.forEach(emp => {
                            html += `<option value="${emp.name}" ${disp.assignedOfficer === emp.name ? 'selected' : ''}>${emp.name}</option>`;
                        });
                    }
                    html += '</select>';
                    html += `<button onclick="editDispatch('${disp.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>`;
                    html += `<button onclick="clearDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Clear</button>`;
                    html += `<button onclick="confirmDeleteDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>`;
                    html += '</td></tr>';
                });
                html += '</table>';
            } else {
                html += '<p class="text-center">No active dispatches.</p>';
            }
            setInterval(checkDispatchTimeouts, 60000);
        } else if (isOfficer) {
            // Officers: Current view with Recent Activity
            const active = dispatchData.filter(d => d.assignedOfficer === user.username && d.status !== 'Completed');
            console.log('Index: Active dispatches for user', user.username, ':', active);
            html += '<h3 class="text-lg font-semibold mb-2">Your Active Dispatches</h3>';
            html += active.length ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' : '<p class="text-center">No active dispatches assigned to you.</p>';
            active.forEach(disp => {
                const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                html += `<div class="bg-gray-700 p-3 rounded shadow"><p><strong>Issue:</strong> ${disp.issue}</p><p><strong>Property:</strong> ${disp.property}</p><p><strong>Status:</strong> <span class="${statusColor}">${disp.status}</span></p></div>`;
            });
            if (active.length) html += '</div>';

            // Recent Activity Section
            const recentReports = reportsData
                .filter(r => r.officer === user.username && r.type === 'Patrol Hit')
                .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                .slice(0, 5);
            html += '<h3 class="text-lg font-semibold mb-2 mt-4">Recent Activity</h3>';
            if (recentReports.length) {
                html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Date</th><th class="p-2 bg-gray-700">Narrative</th></tr>';
                recentReports.forEach(report => {
                    const property = propertiesData.find(p => p.id === report.property)?.propertyName || report.property;
                    html += `<tr><td class="p-2">${property}</td><td class="p-2">${new Date(report.dateTime).toLocaleString()}</td><td class="p-2">${report.narrative}</td></tr>`;
                });
                html += '</table>';
            } else {
                html += '<p class="text-center">No recent patrol hits.</p>';
            }
        }
    } else if (tab === 'route' && !isDispatcher) {
        if (isManagerOrSupervisor) {
            // Managers/Supervisors: Show all officers' routes
            html += '<h3 class="text-lg font-semibold mb-2">All Officers\' Routes</h3>';
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Route</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Address</th><th class="p-2 bg-gray-700">Hits Done</th></tr>';
            employeesData.forEach(officer => {
                const routeNum = officer.route ? parseInt(officer.route.split('-')[1]) : 5;
                const hitsPerOfficer = routeNum === 5 ? 40 : (routeNum === 4 ? 50 : 60);
                const activeProps = propertiesData.filter(p => !p.suspended);
                const propsPerOfficer = Math.ceil(activeProps.length / 5); // Assuming 5 routes total
                const startIdx = employeesData.findIndex(e => e.name === officer.name) * propsPerOfficer;
                const routeProps = activeProps.slice(startIdx, startIdx + propsPerOfficer);

                routeProps.forEach(prop => {
                    const hitsDone = reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length;
                    html += `<tr><td class="p-2">${officer.name}</td><td class="p-2">${officer.route} (${hitsPerOfficer} hits)</td><td class="p-2">${prop.propertyName}</td><td class="p-2">${prop.address}</td><td class="p-2">${hitsDone}/${prop.minHits}</td></tr>`;
                });
            });
            html += '</table>';
        } else if (isOfficer) {
            // Officers: Current route view
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
        html += `
            <h3 class="text-lg font-semibold mb-2">Active Dispatches</h3>
            <div class="mb-4 flex space-x-4">
                <select id="statusFilter" class="bg-gray-700 text-white p-2 rounded" onchange="filterActiveDispatches()">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                </select>
                <select id="sortOrder" class="bg-gray-700 text-white p-2 rounded" onchange="filterActiveDispatches()">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
            <div id="activeDispatchList"></div>
        `;
        dispatchContent.innerHTML = html;
        filterActiveDispatches();
    } else if (tab === 'completed') {
        const completedDispatches = dispatchData ? dispatchData.filter(d => d.status === 'Completed') : [];
        html += '<h3 class="text-lg font-semibold mb-2">Completed Dispatches</h3>';
        if (completedDispatches.length) {
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Priority</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th><th class="p-2 bg-gray-700">Resolve Time</th><th class="p-2 bg-gray-700">Assignment History</th>' + (isDispatcher ? '<th class="p-2 bg-gray-700">Actions</th>' : '') + '</tr>';
            completedDispatches.forEach(disp => {
                if (!isOfficer || disp.assignedOfficer === user.username) {
                    const callTime = new Date(disp.dateTime).toLocaleString();
                    const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                    const resolveTime = disp.resolveTime ? new Date(disp.resolveTime).toLocaleString() : 'N/A';
                    const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                    const history = disp.assignmentHistory ? disp.assignmentHistory.map(h => `${h.officer} at ${new Date(h.timestamp).toLocaleString()}`).join('<br>') : 'N/A';
                    html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.priority}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2"><span class="${statusColor}">${disp.status}</span></td><td class="p-2">${callTime}</td><td class="p-2">${assignedTime}</td><td class="p-2">${resolveTime}</td><td class="p-2">${history}</td>`;
                    if (isDispatcher) {
                        html += '<td class="p-2 space-x-2"><button onclick="restoreDispatch(\'' + disp.id + '\')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow">Restore</button><button onclick="confirmDeleteDispatch(\'' + disp.id + '\')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button></td>';
                    }
                    html += '</tr>';
                }
            });
            html += '</table>';
        } else {
            html += '<p class="text-center">No completed dispatches.</p>';
        }
        dispatchContent.innerHTML = html;
    } else if (tab === 'new') {
        dispatchContent.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">New Dispatch</h3>
            <form id="newDispatchForm" class="edit-form">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="issue">Issue</label>
                    <input type="text" id="issue" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter issue">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="property">Property</label>
                    <input type="text" id="property" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter property">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="priority">Priority</label>
                    <select id="priority" class="bg-gray-700 text-white p-2 rounded w-full">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1" for="notes">Notes</label>
                    <textarea id="notes" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter notes (optional)"></textarea>
                </div>
                <div class="flex space-x-2">
                    <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Create Dispatch</button>
                    <button type="button" onclick="showDispatchTab('active')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
                </div>
            </form>
        `;
        const form = document.getElementById('newDispatchForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const issue = document.getElementById('issue').value;
                const property = document.getElementById('property').value;
                const priority = document.getElementById('priority').value;
                const notes = document.getElementById('notes').value;
                const newDispatch = {
                    id: `D${(dispatchData.length + 1).toString().padStart(3, '0')}`,
                    issue,
                    property,
                    priority,
                    notes,
                    status: 'Pending',
                    assignedOfficer: null,
                    dateTime: new Date().toISOString(),
                    assignmentHistory: []
                };
                dispatchData.push(newDispatch);
                saveDataToLocalStorage();
                showAlert('Dispatch created successfully', 'bg-green-600');
                showDispatchTab('active');
            });
        }
    }
}

function filterActiveDispatches() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const sortOrder = document.getElementById('sortOrder')?.value || 'newest';
    const user = JSON.parse(localStorage.getItem('user'));
    const isOfficer = user.group === 'Officers';
    const isDispatcher = ['Dispatchers', 'Managers', 'Supervisors'].includes(user.group);

    let activeDispatches = dispatchData ? dispatchData.filter(d => d.status !== 'Completed') : [];
    if (statusFilter) {
        activeDispatches = activeDispatches.filter(d => d.status === statusFilter);
    }
    if (sortOrder === 'newest') {
        activeDispatches.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } else {
        activeDispatches.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }

    let html = '';
    if (activeDispatches.length) {
        html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Priority</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th><th class="p-2 bg-gray-700">Assignment History</th><th class="p-2 bg-gray-700">Actions</th></tr>';
        activeDispatches.forEach(disp => {
            if (!isOfficer || disp.assignedOfficer === user.username) {
                const callTime = new Date(disp.dateTime).toLocaleString();
                const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                const history = disp.assignmentHistory ? disp.assignmentHistory.map(h => `${h.officer} at ${new Date(h.timestamp).toLocaleString()}`).join('<br>') : 'N/A';
                html += `<tr><td class="p-2">${disp.issue}</td><td class="p-2">${disp.property}</td><td class="p-2">${disp.priority}</td><td class="p-2">${disp.assignedOfficer || 'Unassigned'}</td><td class="p-2"><span class="${statusColor}">${disp.status}</span></td><td class="p-2">${callTime}</td><td class="p-2">${assignedTime}</td><td class="p-2">${history}</td>`;
                html += '<td class="p-2 space-x-2">';
                if (isDispatcher) {
                    html += `<select onchange="assignOfficer(this, '${disp.id}')" class="bg-gray-700 text-white p-1 rounded">`;
                    html += '<option value="">Assign</option>';
                    if (employeesData) {
                        employeesData.forEach(emp => {
                            html += `<option value="${emp.name}" ${disp.assignedOfficer === emp.name ? 'selected' : ''}>${emp.name}</option>`;
                        });
                    }
                    html += '</select>';
                    html += `<button onclick="editDispatch('${disp.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>`;
                    html += `<button onclick="clearDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Clear</button>`;
                    html += `<button onclick="confirmDeleteDispatch('${disp.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>`;
                }
                if (isOfficer && disp.assignedOfficer === user.username && disp.status !== 'In Progress') {
                    html += `<button onclick="setDispatchInProgress('${disp.id}')" class="bg-orange-600 hover:bg-orange-700 p-1 rounded text-sm shadow">In Progress</button>`;
                }
                html += '</td></tr>';
            }
        });
        html += '</table>';
    } else {
        html += '<p class="text-center">No active dispatches.</p>';
    }
    const activeDispatchList = document.getElementById('activeDispatchList');
    if (activeDispatchList) {
        activeDispatchList.innerHTML = html;
    }
}

function editDispatch(id) {
    const dispatch = dispatchData.find(d => d.id === id);
    if (!dispatch) return;

    const dispatchContent = document.getElementById('dispatchContent');
    dispatchContent.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Edit Dispatch</h3>
        <form id="editDispatchForm-${id}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="issue-${id}">Issue</label>
                <input type="text" id="issue-${id}" value="${dispatch.issue}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="property-${id}">Property</label>
                <input type="text" id="property-${id}" value="${dispatch.property}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="priority-${id}">Priority</label>
                <select id="priority-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Low" ${dispatch.priority === 'Low' ? 'selected' : ''}>Low</option>
                    <option value="Medium" ${dispatch.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="High" ${dispatch.priority === 'High' ? 'selected' : ''}>High</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="status-${id}">Status</label>
                <select id="status-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Pending" ${dispatch.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Assigned" ${dispatch.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
                    <option value="In Progress" ${dispatch.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="notes-${id}">Notes</label>
                <textarea id="notes-${id}" class="bg-gray-700 text-white p-2 rounded w-full">${dispatch.notes || ''}</textarea>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="showDispatchTab('active')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editDispatchForm-${id}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            issue: document.getElementById(`issue-${id}`).value,
            property: document.getElementById(`property-${id}`).value,
            priority: document.getElementById(`priority-${id}`).value,
            status: document.getElementById(`status-${id}`).value,
            notes: document.getElementById(`notes-${id}`).value
        };
        updateDispatch(id, updates);
        showAlert('Dispatch updated successfully', 'bg-green-600');
        showDispatchTab('active');
    });
}

function setDispatchInProgress(id) {
    const dispatch = dispatchData.find(d => d.id === id);
    if (dispatch) {
        updateDispatch(id, { status: 'In Progress' });
        showAlert('Dispatch set to In Progress', 'bg-orange-600');
        filterActiveDispatches();
    }
}

function assignOfficer(select, dispatchId) {
    const officer = select.value;
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        const historyEntry = { officer: officer || 'Unassigned', timestamp: new Date().toISOString() };
        const assignmentHistory = dispatch.assignmentHistory ? [...dispatch.assignmentHistory, historyEntry] : [historyEntry];
        updateDispatch(dispatchId, {
            assignedOfficer: officer || null,
            status: officer ? 'Assigned' : 'Pending',
            assignedTime: officer ? new Date().toISOString() : null,
            assignmentHistory
        });
        // Notify the officer if assigned
        if (officer) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.username === officer) {
                showAlert(`You have been assigned to dispatch ${dispatchId}: ${dispatch.issue}`, 'bg-blue-600');
            }
        }
        showDispatchTab('active');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}

function clearDispatch(dispatchId) {
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        updateDispatch(dispatchId, { status: 'Completed', resolveTime: new Date().toISOString() });
        showAlert('Dispatch cleared successfully', 'bg-green-600');
        showDispatchTab('active');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}

function restoreDispatch(dispatchId) {
    const dispatch = dispatchData.find(d => d.id === dispatchId);
    if (dispatch) {
        updateDispatch(dispatchId, { status: 'Pending', resolveTime: null });
        showAlert('Dispatch restored successfully', 'bg-blue-600');
        showDispatchTab('completed');
    } else {
        showAlert('Dispatch not found', 'bg-red-600');
    }
}

function confirmDeleteDispatch(id) {
    if (confirm('Are you sure you want to delete this dispatch? This action cannot be undone.')) {
        deleteDispatch(id);
        showAlert('Dispatch deleted successfully', 'bg-green-600');
        showDispatchTab('active');
    }
}

function showProperties() {
    const mainContent = document.getElementById('main-content');
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Properties</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter properties by name, address, or suspended status. Managers can add/edit/delete properties.</p>
        </div>
        <div class="mb-4 flex space-x-4">
            <input type="text" id="propertySearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search properties..." onkeyup="filterProperties()">
            <select id="propertySuspendedFilter" class="bg-gray-700 text-white p-2 rounded" onchange="filterProperties()">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
            </select>
            ${isManager ? `<button onclick="addNewProperty()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Property</button>` : ''}
        </div>
        <div id="propertyList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate properties
    filterProperties();
}

function filterProperties() {
    const search = document.getElementById('propertySearch')?.value.toLowerCase() || '';
    const suspendedFilter = document.getElementById('propertySuspendedFilter')?.value || '';
    let properties = propertiesData.filter(p => 
        (p.propertyName.toLowerCase().includes(search) || p.address.toLowerCase().includes(search)) &&
        (suspendedFilter === '' || (suspendedFilter === 'active' && !p.suspended) || (suspendedFilter === 'suspended' && p.suspended))
    );
    let html = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';

    properties.forEach(prop => {
        const reports = reportsData.filter(r => r.property === prop.id);
        html += `
            <div class="bg-gray-700 p-3 rounded shadow" id="property-${prop.id}">
                <p><strong>${prop.propertyName}</strong></p>
                <p><strong>Address:</strong> ${prop.address}${prop.apt ? ', ' + prop.apt : ''}</p>
                <p><strong>Min Hits:</strong> ${prop.minHits}</p>
                <p><strong>Notes:</strong> ${prop.notes || 'N/A'}</p>
                <p><strong>Reports:</strong> ${reports.length}</p>
                <p><strong>Status:</strong> ${prop.suspended ? 'Suspended' : 'Active'}</p>
                ${isManager ? `
                <div class="flex space-x-2 mt-2">
                    <button onclick="editProperty('${prop.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeleteProperty('${prop.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    const propertyList = document.getElementById('propertyList');
    if (propertyList) {
        propertyList.innerHTML = html || '<p class="text-center">No properties found.</p>';
    }
}

function addNewProperty() {
    const newId = `PROP${(propertiesData.length + 1).toString().padStart(3, '0')}`;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Add New Property</h2>
        <form id="addPropertyForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="propertyName">Property Name</label>
                <input type="text" id="propertyName" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter property name">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="address">Address</label>
                <input type="text" id="address" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter address">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="apt">Apartment</label>
                <input type="text" id="apt" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter apartment (optional)">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="minHits">Min Hits</label>
                <input type="number" id="minHits" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter min hits">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="notes">Notes</label>
                <textarea id="notes" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter notes (optional)"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="suspended">Suspended</label>
                <select id="suspended" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add Property</button>
                <button type="button" onclick="showProperties()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
        <div id="alert" class="hidden"></div>
    `;

    const form = document.getElementById('addPropertyForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProperty = {
            id: newId,
            propertyName: document.getElementById('propertyName').value,
            address: document.getElementById('address').value,
            apt: document.getElementById('apt').value,
            minHits: parseInt(document.getElementById('minHits').value),
            notes: document.getElementById('notes').value,
            suspended: document.getElementById('suspended').value === 'true'
        };
        addProperty(newProperty);
        showAlert('Property added successfully', 'bg-green-600');
        showProperties();
    });
}

function editProperty(id) {
    const prop = propertiesData.find(p => p.id === id);
    if (!prop) return;

    const card = document.getElementById(`property-${id}`);
    card.innerHTML = `
        <form id="editPropertyForm-${id}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="propertyName-${id}">Property Name</label>
                <input type="text" id="propertyName-${id}" value="${prop.propertyName}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="address-${id}">Address</label>
                <input type="text" id="address-${id}" value="${prop.address}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="apt-${id}">Apartment</label>
                <input type="text" id="apt-${id}" value="${prop.apt || ''}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="minHits-${id}">Min Hits</label>
                <input type="number" id="minHits-${id}" value="${prop.minHits}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="notes-${id}">Notes</label>
                <textarea id="notes-${id}" class="bg-gray-700 text-white p-2 rounded w-full">${prop.notes || ''}</textarea>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="suspended-${id}">Suspended</label>
                <select id="suspended-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="false" ${!prop.suspended ? 'selected' : ''}>No</option>
                    <option value="true" ${prop.suspended ? 'selected' : ''}>Yes</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="filterProperties()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editPropertyForm-${id}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedProperty = {
            id: prop.id,
            propertyName: document.getElementById(`propertyName-${id}`).value,
            address: document.getElementById(`address-${id}`).value,
            apt: document.getElementById(`apt-${id}`).value,
            minHits: parseInt(document.getElementById(`minHits-${id}`).value),
            notes: document.getElementById(`notes-${id}`).value,
            suspended: document.getElementById(`suspended-${id}`).value === 'true'
        };
        updateProperty(prop.id, updatedProperty);
        showAlert('Property updated successfully', 'bg-green-600');
        filterProperties();
    });
}

function confirmDeleteProperty(id) {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
        deleteProperty(id);
        showAlert('Property deleted successfully', 'bg-green-600');
        filterProperties();
    }
}

function showPeople() {
    const mainContent = document.getElementById('main-content');
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">People</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter people by name, property, or CTN status. Managers can add/edit/delete people.</p>
        </div>
        <div class="mb-4 flex space-x-4">
            <input type="text" id="peopleSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search people..." onkeyup="filterPeople()">
            <select id="peopleCtnFilter" class="bg-gray-700 text-white p-2 rounded" onchange="filterPeople()">
                <option value="">All</option>
                <option value="CTN Issued">CTN Issued</option>
                <option value="N/A">No CTN</option>
            </select>
            ${isManager ? `<button onclick="addNewPerson()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Person</button>` : ''}
        </div>
        <div id="peopleList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate people
    filterPeople();
}

function filterPeople() {
    const search = document.getElementById('peopleSearch')?.value.toLowerCase() || '';
    const ctnFilter = document.getElementById('peopleCtnFilter')?.value || '';
    let people = peopleData.filter(p => 
        (p.name.toLowerCase().includes(search) || p.property.toLowerCase().includes(search)) &&
        (ctnFilter === '' || p.ctnStatus === ctnFilter)
    );
    let html = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';

    people.forEach(person => {
        const behaviorClass = {
            Friendly: 'friendly-text',
            Cautious: 'cautious-text',
            Hostile: 'hostile-text',
            Unknown: 'unknown-text'
        }[person.behavior] || 'unknown-text';
        const ctnClass = person.ctnStatus === 'CTN Issued' ? 'ctn-active' : '';
        html += `
            <div class="bg-gray-700 p-3 rounded shadow ${ctnClass}" id="person-${person.id}">
                <p><strong class="name">${person.name}</strong></p>
                <p><strong>DOB:</strong> ${person.dob}</p>
                <p><strong>Status:</strong> ${person.status}</p>
                <p><strong>Property:</strong> ${person.property}</p>
                <p><strong>Behavior:</strong> <span class="${behaviorClass}">${person.behavior}</span></p>
                <p><strong>CTN Status:</strong> ${person.ctnStatus}</p>
                ${isManager ? `
                <div class="flex space-x-2 mt-2">
                    <button onclick="editPerson('${person.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeletePerson('${person.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    const peopleList = document.getElementById('peopleList');
    if (peopleList) {
        peopleList.innerHTML = html || '<p class="text-center">No people found.</p>';
    }
}

function addNewPerson() {
    const newId = `P${(peopleData.length + 1).toString().padStart(3, '0')}`;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Add New Person</h2>
        <form id="addPersonForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="name">Name</label>
                <input type="text" id="name" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter name">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="dob">DOB</label>
                <input type="date" id="dob" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="status">Status</label>
                <select id="status" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Staff">Staff</option>
                    <option value="Trespasser">Trespasser</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="property">Property</label>
                <input type="text" id="property" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter property">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="behavior">Behavior</label>
                <select id="behavior" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Friendly">Friendly</option>
                    <option value="Cautious">Cautious</option>
                    <option value="Hostile">Hostile</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="ctnStatus">CTN Status</label>
                <select id="ctnStatus" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="N/A">N/A</option>
                    <option value="CTN Issued">CTN Issued</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add Person</button>
                <button type="button" onclick="showPeople()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
        <div id="alert" class="hidden"></div>
    `;

    const form = document.getElementById('addPersonForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPerson = {
            id: newId,
            name: document.getElementById('name').value,
            dob: document.getElementById('dob').value,
            status: document.getElementById('status').value,
            property: document.getElementById('property').value,
            behavior: document.getElementById('behavior').value,
            ctnStatus: document.getElementById('ctnStatus').value
        };
        addPerson(newPerson);
        showAlert('Person added successfully', 'bg-green-600');
        showPeople();
    });
}

function editPerson(id) {
    const person = peopleData.find(p => p.id === id);
    if (!person) return;

    const card = document.getElementById(`person-${id}`);
    card.innerHTML = `
        <form id="editPersonForm-${id}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="name-${id}">Name</label>
                <input type="text" id="name-${id}" value="${person.name}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="dob-${id}">DOB</label>
                <input type="date" id="dob-${id}" value="${person.dob}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="status-${id}">Status</label>
                <select id="status-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Staff" ${person.status === 'Staff' ? 'selected' : ''}>Staff</option>
                    <option value="Trespasser" ${person.status === 'Trespasser' ? 'selected' : ''}>Trespasser</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="property-${id}">Property</label>
                <input type="text" id="property-${id}" value="${person.property}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="behavior-${id}">Behavior</label>
                <select id="behavior-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Friendly" ${person.behavior === 'Friendly' ? 'selected' : ''}>Friendly</option>
                    <option value="Cautious" ${person.behavior === 'Cautious' ? 'selected' : ''}>Cautious</option>
                    <option value="Hostile" ${person.behavior === 'Hostile' ? 'selected' : ''}>Hostile</option>
                    <option value="Unknown" ${person.behavior === 'Unknown' ? 'selected' : ''}>Unknown</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="ctnStatus-${id}">CTN Status</label>
                <select id="ctnStatus-${id}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="N/A" ${person.ctnStatus === 'N/A' ? 'selected' : ''}>N/A</option>
                    <option value="CTN Issued" ${person.ctnStatus === 'CTN Issued' ? 'selected' : ''}>CTN Issued</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="filterPeople()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editPersonForm-${id}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedPerson = {
            id: person.id,
            name: document.getElementById(`name-${id}`).value,
            dob: document.getElementById(`dob-${id}`).value,
            status: document.getElementById(`status-${id}`).value,
            property: document.getElementById(`property-${id}`).value,
            behavior: document.getElementById(`behavior-${id}`).value,
            ctnStatus: document.getElementById(`ctnStatus-${id}`).value
        };
        updatePerson(person.id, updatedPerson);
        showAlert('Person updated successfully', 'bg-green-600');
        filterPeople();
    });
}

function confirmDeletePerson(id) {
    if (confirm('Are you sure you want to delete this person? This action cannot be undone.')) {
        deletePerson(id);
        showAlert('Person deleted successfully', 'bg-green-600');
        filterPeople();
    }
}

function showReports() {
    const mainContent = document.getElementById('main-content');
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Reports</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Search: Filter reports by case number, property, or type. Managers can add/edit/delete reports.</p>
        </div>
        <div class="mb-4 flex space-x-4">
            <input type="text" id="reportSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search reports..." onkeyup="filterReports()">
            <select id="reportTypeFilter" class="bg-gray-700 text-white p-2 rounded" onchange="filterReports()">
                <option value="">All Types</option>
                <option value="Patrol Hit">Patrol Hit</option>
                <option value="Incident">Incident</option>
            </select>
            ${isManager ? `<button onclick="addNewReport()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Report</button>` : ''}
        </div>
        <div id="reportList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    // Populate reports
    filterReports();
}

function filterReports() {
    const search = document.getElementById('reportSearch')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('reportTypeFilter')?.value || '';
    let reports = reportsData.filter(r => 
        (r.caseNumber.toLowerCase().includes(search) || 
         r.property.toLowerCase().includes(search) || 
         r.type.toLowerCase().includes(search)) &&
        (typeFilter === '' || r.type === typeFilter)
    );
    let html = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';

    reports.forEach(report => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow" id="report-${report.caseNumber}">
                <p><strong>Case #:</strong> ${report.caseNumber}</p>
                <p><strong>Date:</strong> ${new Date(report.dateTime).toLocaleString()}</p>
                <p><strong>Property:</strong> ${report.property}</p>
                <p><strong>Type:</strong> ${report.type}</p>
                <p><strong>Narrative:</strong> ${report.narrative}</p>
                <p><strong>Officer:</strong> ${report.officer}</p>
                ${isManager ? `
                <div class="flex space-x-2 mt-2">
                    <button onclick="editReport('${report.caseNumber}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeleteReport('${report.caseNumber}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
                ` : ''}
            </div>
        `;
    });
    const reportList = document.getElementById('reportList');
    if (reportList) {
        reportList.innerHTML = html || '<p class="text-center">No reports found.</p>';
    }
}

function addNewReport() {
    const newCaseNumber = `25-0314${(reportsData.length + 1).toString().padStart(4, '0')}`;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Add New Report</h2>
        <form id="addReportForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="caseNumber">Case #</label>
                <input type="text" id="caseNumber" value="${newCaseNumber}" class="bg-gray-700 text-white p-2 rounded w-full" readonly>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="dateTime">Date</label>
                <input type="datetime-local" id="dateTime" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="property">Property</label>
                <input type="text" id="property" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter property">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="type">Type</label>
                <select id="type" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Patrol Hit">Patrol Hit</option>
                    <option value="Incident">Incident</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="narrative">Narrative</label>
                <textarea id="narrative" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter narrative"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="officer">Officer</label>
                <input type="text" id="officer" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter officer name">
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add Report</button>
                <button type="button" onclick="showReports()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
        <div id="alert" class="hidden"></div>
    `;

   const form = document.getElementById('addReportForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newReport = {
        caseNumber: newCaseNumber,
        dateTime: new Date(document.getElementById('dateTime').value).toISOString(),
        personId: 'N/A', // Default value
        property: document.getElementById('property').value,
        type: document.getElementById('type').value,
        narrative: document.getElementById('narrative').value,
        officer: document.getElementById('officer').value
    };
    addReport(newReport);
    showAlert('Report added successfully', 'bg-green-600');
    showReports();
});
