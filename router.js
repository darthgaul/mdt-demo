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

function toggleSidebar(sidebarId) {
    const sidebar = document.getElementById(sidebarId);
    if (sidebar) sidebar.classList.toggle('hidden');
}
window.toggleSidebar = toggleSidebar;

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

    // Load initial tab content first
    showDashboardTab('overview');

    // Then initialize dashboard after HTML is rendered
    if (window.initializeDashboard) {
        window.initializeDashboard();
    } else {
        console.warn('initializeDashboard is not defined');
    }
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
                html += `<tr><td class="p-2 ${statusColor}">${emp.name}</td><td class="p-2">${emp.route || emp.assignedProperty ? propertiesData.find(p => p.id === emp.assignedProperty)?.propertyName || 'N/A' : 'N/A'}</td><td class="p-2">${new Date(emp.schedule.start).toLocaleTimeString()}</td><td class="p-2">${new Date(emp.schedule.end).toLocaleTimeString()}</td><td class="p-2">${emp.status || 'Offline'}</td><td class="p-2">${activeDispatches}</td></tr>`;
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
        const employee = employeesData.find(e => e.name === user.username);
        if (isManagerOrSupervisor) {
            // Managers/Supervisors: Show all officers' routes
            html += '<h3 class="text-lg font-semibold mb-2">All Officers\' Routes</h3>';
            html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Type</th><th class="p-2 bg-gray-700">Route/Property</th><th class="p-2 bg-gray-700">Details</th></tr>';
            employeesData.forEach(officer => {
                if (officer.type === 'Patrol') {
                    const route = routesData.find(r => r.id === officer.route);
                    if (route) {
                        const properties = route.propertyIds.map(id => {
                            const prop = propertiesData.find(p => p.id === id);
                            const hitsDone = reportsData.filter(r => r.property === id && r.type === 'Patrol Hit').length;
                            return prop ? `${prop.propertyName} (${hitsDone}/${prop.minHits} hits)` : 'Unknown';
                        }).join(', ');
                        html += `<tr><td class="p-2">${officer.name}</td><td class="p-2">${officer.type}</td><td class="p-2">${route.name}</td><td class="p-2">${properties}</td></tr>`;
                    } else {
                        html += `<tr><td class="p-2">${officer.name}</td><td class="p-2">${officer.type}</td><td class="p-2">No Route Assigned</td><td class="p-2">N/A</td></tr>`;
                    }
                } else if (officer.type === 'Static') {
                    const prop = propertiesData.find(p => p.id === officer.assignedProperty);
                    const hitsDone = prop ? reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length : 0;
                    const propDetails = prop ? `${prop.propertyName} (${hitsDone}/${prop.minHits} hits)` : 'No Property Assigned';
                    html += `<tr><td class="p-2">${officer.name}</td><td class="p-2">${officer.type}</td><td class="p-2">${prop ? prop.propertyName : 'N/A'}</td><td class="p-2">${prop ? prop.address : 'N/A'}</td></tr>`;
                } else {
                    html += `<tr><td class="p-2">${officer.name}</td><td class="p-2">N/A</td><td class="p-2">N/A</td><td class="p-2">N/A</td></tr>`;
                }
            });
            html += '</table>';
        } else if (isOfficer) {
            // Officers: Show route for Patrol, property for Static
            if (employee.type === 'Patrol') {
                const route = routesData.find(r => r.id === employee.route);
                if (route) {
                    html += `<h3 class="text-lg font-semibold mb-2">Your Route: ${route.name}</h3>`;
                    html += '<div class="grid grid-cols-1 gap-4">';
                    route.propertyIds.forEach(propId => {
                        const prop = propertiesData.find(p => p.id === propId);
                        if (prop) {
                            const hitsDone = reportsData.filter(r => r.property === propId && r.type === 'Patrol Hit').length;
                            html += `
                                <div class="bg-gray-700 p-3 rounded shadow">
                                    <p><strong>${prop.propertyName}</strong></p>
                                    <p>${prop.address}</p>
                                    <p><strong>Hits Done:</strong> ${hitsDone}/${prop.minHits}</p>
                                    <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2 mr-2">Navigate</button>
                                    <button onclick="arrive('${prop.id}')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow mt-2">Arrived</button>
                                </div>
                            `;
                        }
                    });
                    html += '</div>';
                } else {
                    html += '<p class="text-center">No route assigned.</p>';
                }
            } else if (employee.type === 'Static') {
                const prop = propertiesData.find(p => p.id === employee.assignedProperty);
                if (prop) {
                    const hitsDone = reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length;
                    html += `<h3 class="text-lg font-semibold mb-2">Your Property: ${prop.propertyName}</h3>`;
                    html += `
                        <div class="bg-gray-700 p-3 rounded shadow">
                            <p>${prop.address}</p>
                            <p><strong>Hits Done:</strong> ${hitsDone}/${prop.minHits}</p>
                            <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2 mr-2">Navigate</button>
                            <button onclick="arrive('${prop.id}')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow mt-2">Arrived</button>
                        </div>
                    `;
                } else {
                    html += '<p class="text-center">No property assigned.</p>';
                }
            }
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
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Active Dispatches: Filter by status or sort by call time. Assign officers using the dropdown.</p>
            <p>Example: Set a dispatch to "In Progress" as an officer, or clear it as a dispatcher.</p>
        </div>
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
            <p>Properties are organized by routes. Managers can add/edit/delete properties.</p>
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
        <div id="propertyList" class="grid grid-cols-1 gap-4"></div>
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
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';

    let html = '';

    // Organize properties by routes
    // Organize properties by routes
    routesData.forEach(route => {
        const routeProperties = properties.filter(p => route.propertyIds.includes(p.id));
        if (routeProperties.length > 0) {
            html += `<h3 class="text-lg font-semibold mb-2 mt-4">${route.name}</h3>`;
            html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
            routeProperties.forEach(prop => {
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
            html += '</div>';
        }
    });

    // Unassigned properties
    const unassignedProperties = properties.filter(p => !routesData.some(r => r.propertyIds.includes(p.id)));
    if (unassignedProperties.length > 0) {
        html += `<h3 class="text-lg font-semibold mb-2 mt-4">Unassigned Properties</h3>`;
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
        unassignedProperties.forEach(prop => {
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
        html += '</div>';
    }

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
        const updates = {
            propertyName: document.getElementById(`propertyName-${id}`).value,
            address: document.getElementById(`address-${id}`).value,
            apt: document.getElementById(`apt-${id}`).value,
            minHits: parseInt(document.getElementById(`minHits-${id}`).value),
            notes: document.getElementById(`notes-${id}`).value,
            suspended: document.getElementById(`suspended-${id}`).value === 'true'
        };
        updateProperty(id, updates);
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
            <p>Search: Filter people by name or property. Managers can add/edit/delete people.</p>
        </div>
        <div class="mb-4 flex space-x-4">
            <input type="text" id="peopleSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search people..." onkeyup="filterPeople()">
            ${isManager ? `<button onclick="addNewPerson()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Person</button>` : ''}
        </div>
        <div id="peopleList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        <div id="alert" class="hidden"></div>
    `;
    filterPeople();
}

function filterPeople() {
    const search = document.getElementById('peopleSearch')?.value.toLowerCase() || '';
    const people = peopleData.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.property.toLowerCase().includes(search)
    );
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user && user.group === 'Managers';
    let html = '';

    people.forEach(person => {
        const behaviorClass = {
            Friendly: 'friendly-text',
            Cautious: 'cautious-text',
            Hostile: 'hostile-text',
            Unknown: 'unknown-text'
        }[person.behavior];
        html += `
            <div class="bg-gray-700 p-3 rounded shadow ${person.ctnStatus === 'CTN Issued' ? 'ctn-active' : ''}" id="person-${person.id}">
                <p><strong>Name:</strong> <span class="name ${behaviorClass}">${person.name}</span></p>
                <p><strong>DOB:</strong> ${person.dob}</p>
                <p><strong>Status:</strong> ${person.status}</p>
                <p><strong>Property:</strong> ${person.property}</p>
                <p><strong>Behavior:</strong> <span class="behavior ${behaviorClass}">${person.behavior}</span></p>
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
}

function editReport(caseNumber) {
    const report = reportsData.find(r => r.caseNumber === caseNumber);
    if (!report) return;

    const card = document.getElementById(`report-${caseNumber}`);
    card.innerHTML = `
        <form id="editReportForm-${caseNumber}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="caseNumber-${caseNumber}">Case #</label>
                <input type="text" id="caseNumber-${caseNumber}" value="${report.caseNumber}" class="bg-gray-700 text-white p-2 rounded w-full" readonly>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="dateTime-${caseNumber}">Date</label>
                <input type="datetime-local" id="dateTime-${caseNumber}" value="${report.dateTime.slice(0, 16)}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="property-${caseNumber}">Property</label>
                <input type="text" id="property-${caseNumber}" value="${report.property}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="type-${caseNumber}">Type</label>
                <select id="type-${caseNumber}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Patrol Hit" ${report.type === 'Patrol Hit' ? 'selected' : ''}>Patrol Hit</option>
                    <option value="Incident" ${report.type === 'Incident' ? 'selected' : ''}>Incident</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="narrative-${caseNumber}">Narrative</label>
                <textarea id="narrative-${caseNumber}" class="bg-gray-700 text-white p-2 rounded w-full">${report.narrative}</textarea>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="officer-${caseNumber}">Officer</label>
                <input type="text" id="officer-${caseNumber}" value="${report.officer}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="filterReports()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editReportForm-${caseNumber}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedReport = {
            caseNumber: report.caseNumber,
            dateTime: new Date(document.getElementById(`dateTime-${caseNumber}`).value).toISOString(),
            personId: report.personId, // Preserve existing value
            property: document.getElementById(`property-${caseNumber}`).value,
            type: document.getElementById(`type-${caseNumber}`).value,
            narrative: document.getElementById(`narrative-${caseNumber}`).value,
            officer: document.getElementById(`officer-${caseNumber}`).value
        };
        updateReport(report.caseNumber, updatedReport);
        showAlert('Report updated successfully', 'bg-green-600');
        filterReports();
    });
}

function confirmDeleteReport(caseNumber) {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        deleteReport(caseNumber);
        showAlert('Report deleted successfully', 'bg-green-600');
        filterReports();
    }
}

function showManager() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Manager Dashboard</h2>
        <div class="tips">
            <h4 class="text-lg font-semibold">Tips</h4>
            <p>Users: Add/edit/delete users. Employees: Manage employee schedules and routes. Properties: Add/edit/delete properties. Routes: Create and manage patrol routes.</p>
        </div>
        <div class="flex space-x-4 mb-4">
            <button onclick="showManagerTab('users')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Users</button>
            <button onclick="showManagerTab('employees')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Employees</button>
            <button onclick="showManagerTab('properties')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Properties</button>
            <button onclick="showManagerTab('routes')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Routes</button>
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
            <div class="mb-4 flex space-x-4">
                <input type="text" id="userSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search users..." onkeyup="filterUsers()">
                <button onclick="addNewUser()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New User</button>
            </div>
            <div id="userList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterUsers();
    } else if (tab === 'employees') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Employees</h3>';
        html += `
            <div class="mb-4 flex space-x-4">
                <input type="text" id="employeeSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search employees..." onkeyup="filterEmployees()">
                <button onclick="addNewEmployee()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Employee</button>
            </div>
            <div id="employeeList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterEmployees();
    } else if (tab === 'properties') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Properties</h3>';
        html += `
            <div class="mb-4 flex space-x-4">
                <input type="text" id="propertySearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search properties..." onkeyup="filterProperties()">
                <select id="propertySuspendedFilter" class="bg-gray-700 text-white p-2 rounded" onchange="filterProperties()">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
                <button onclick="addNewProperty()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Property</button>
            </div>
        `;
        // Organize properties by routes
        routesData.forEach(route => {
            const routeProperties = propertiesData.filter(p => route.propertyIds.includes(p.id));
            if (routeProperties.length > 0) {
                html += `<h4 class="text-md font-medium mt-4">${route.name}</h4>`;
                html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
                routeProperties.forEach(prop => {
                    const reports = reportsData.filter(r => r.property === prop.id);
                    html += `
                        <div class="bg-gray-700 p-3 rounded shadow" id="property-${prop.id}">
                            <p><strong>${prop.propertyName}</strong></p>
                            <p><strong>Address:</strong> ${prop.address}${prop.apt ? ', ' + prop.apt : ''}</p>
                            <p><strong>Min Hits:</strong> ${prop.minHits}</p>
                            <p><strong>Notes:</strong> ${prop.notes || 'N/A'}</p>
                            <p><strong>Reports:</strong> ${reports.length}</p>
                            <p><strong>Status:</strong> ${prop.suspended ? 'Suspended' : 'Active'}</p>
                            <div class="flex space-x-2 mt-2">
                                <button onclick="editProperty('${prop.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                                <button onclick="confirmDeleteProperty('${prop.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        });
        // Unassigned properties
        const unassigned = propertiesData.filter(p => !routesData.some(r => r.propertyIds.includes(p.id)));
        if (unassigned.length > 0) {
            html += `<h4 class="text-md font-medium mt-4">Unassigned Properties</h4>`;
            html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
            unassigned.forEach(prop => {
                const reports = reportsData.filter(r => r.property === prop.id);
                html += `
                    <div class="bg-gray-700 p-3 rounded shadow" id="property-${prop.id}">
                        <p><strong>${prop.propertyName}</strong></p>
                        <p><strong>Address:</strong> ${prop.address}${prop.apt ? ', ' + prop.apt : ''}</p>
                        <p><strong>Min Hits:</strong> ${prop.minHits}</p>
                        <p><strong>Notes:</strong> ${prop.notes || 'N/A'}</p>
                        <p><strong>Reports:</strong> ${reports.length}</p>
                        <p><strong>Status:</strong> ${prop.suspended ? 'Suspended' : 'Active'}</p>
                        <div class="flex space-x-2 mt-2">
                            <button onclick="editProperty('${prop.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                            <button onclick="confirmDeleteProperty('${prop.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        managerContent.innerHTML = html;
    } else if (tab === 'routes') {
        html += '<h3 class="text-lg font-semibold mb-2">Manage Routes</h3>';
        html += `
            <div class="mb-4 flex space-x-4">
                <input type="text" id="routeSearch" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Search routes..." onkeyup="filterRoutes()">
                <button onclick="addNewRoute()" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add New Route</button>
            </div>
            <div id="routeList" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
        `;
        managerContent.innerHTML = html;
        filterRoutes();
    }
}

function addNewUser() {
    const mainContent = document.getElementById('managerContent');
    mainContent.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Add New User</h3>
        <form id="addUserForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="username">Username</label>
                <input type="text" id="username" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter username">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="password">Password</label>
                <input type="text" id="password" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter password">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="group">Group</label>
                <select id="group" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Managers">Managers</option>
                    <option value="Supervisors">Supervisors</option>
                    <option value="Officers">Officers</option>
                    <option value="Dispatchers">Dispatchers</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add User</button>
                <button type="button" onclick="showManagerTab('users')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById('addUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const group = document.getElementById('group').value;
        addUser(username, password, group);
        showAlert('User added successfully', 'bg-green-600');
        showManagerTab('users');
    });
}

function filterUsers() {
    const search = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const users = usersData.filter(u => u.username.toLowerCase().includes(search));
    let html = '';
    users.forEach(user => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow" id="user-${user.username}">
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Group:</strong> ${user.group}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="editUser('${user.username}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeleteUser('${user.username}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
            </div>
        `;
    });
    const userList = document.getElementById('userList');
    if (userList) {
        userList.innerHTML = html || '<p class="text-center">No users found.</p>';
    }
}

function confirmDeleteUser(username) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        deleteUser(username);
        showAlert('User deleted successfully', 'bg-green-600');
        filterUsers();
    }
}

function editUser(username) {
    const user = usersData.find(u => u.username === username);
    if (!user) return;

    const card = document.getElementById(`user-${username}`);
    card.innerHTML = `
        <form id="editUserForm-${username}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="username-${username}">Username</label>
                <input type="text" id="username-${username}" value="${user.username}" class="bg-gray-700 text-white p-2 rounded w-full" readonly>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="password-${username}">Password</label>
                <input type="text" id="password-${username}" value="${user.password}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="group-${username}">Group</label>
                <select id="group-${username}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Managers" ${user.group === 'Managers' ? 'selected' : ''}>Managers</option>
                    <option value="Supervisors" ${user.group === 'Supervisors' ? 'selected' : ''}>Supervisors</option>
                    <option value="Officers" ${user.group === 'Officers' ? 'selected' : ''}>Officers</option>
                    <option value="Dispatchers" ${user.group === 'Dispatchers' ? 'selected' : ''}>Dispatchers</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="filterUsers()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editUserForm-${username}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById(`password-${username}`).value;
        const newGroup = document.getElementById(`group-${username}`).value;
        if (newPassword || newGroup) {
            updateUser(username, newPassword, newGroup);
            showAlert('User updated successfully', 'bg-green-600');
            filterUsers();
        }
    });
}

function addNewEmployee() {
    const mainContent = document.getElementById('managerContent');
    mainContent.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Add New Employee</h3>
        <form id="addEmployeeForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="name">Name</label>
                <input type="text" id="name" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter name">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="type">Officer Type</label>
                <select id="type" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Patrol">Patrol Officer</option>
                    <option value="Static">Static Officer</option>
                </select>
            </div>
            <div class="mb-4" id="routeField">
                <label class="block text-sm font-medium mb-1" for="route">Route</label>
                <select id="route" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="">Select Route</option>
                    ${routesData.map(route => `<option value="${route.id}">${route.name}</option>`).join('')}
                </select>
            </div>
            <div class="mb-4 hidden" id="propertyField">
                <label class="block text-sm font-medium mb-1" for="assignedProperty">Assigned Property</label>
                <select id="assignedProperty" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="">Select Property</option>
                    ${propertiesData.map(prop => `<option value="${prop.id}">${prop.propertyName}</option>`).join('')}
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="start">Schedule Start</label>
                <input type="datetime-local" id="start" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="end">Schedule End</label>
                <input type="datetime-local" id="end" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="location">Location</label>
                <input type="text" id="location" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter location">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="department">Department</label>
                <select id="department" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Supervisors">Supervisors</option>
                    <option value="Officers">Officers</option>
                    <option value="Dispatchers">Dispatchers</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="status">Status</label>
                <select id="status" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="10-8">10-8</option>
                    <option value="10-6">10-6</option>
                    <option value="10-42">10-42</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add Employee</button>
                <button type="button" onclick="showManagerTab('employees')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const typeSelect = document.getElementById('type');
    const routeField = document.getElementById('routeField');
    const propertyField = document.getElementById('propertyField');
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Patrol') {
            routeField.classList.remove('hidden');
            propertyField.classList.add('hidden');
        } else {
            routeField.classList.add('hidden');
            propertyField.classList.remove('hidden');
        }
    });

    const form = document.getElementById('addEmployeeForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEmployee = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            route: document.getElementById('type').value === 'Patrol' ? document.getElementById('route').value : '',
            assignedProperty: document.getElementById('type').value === 'Static' ? document.getElementById('assignedProperty').value : '',
            schedule: {
                start: new Date(document.getElementById('start').value).toISOString(),
                end: new Date(document.getElementById('end').value).toISOString()
            },
            location: document.getElementById('location').value,
            department: document.getElementById('department').value,
            status: document.getElementById('status').value
        };
        addEmployee(newEmployee);
        showAlert('Employee added successfully', 'bg-green-600');
        showManagerTab('employees');
    });
}

function filterEmployees() {
    const search = document.getElementById('employeeSearch')?.value.toLowerCase() || '';
    const employees = employeesData.filter(e => e.name.toLowerCase().includes(search));
    let html = '';
    employees.forEach(emp => {
        html += `
            <div class="bg-gray-700 p-3 rounded shadow" id="employee-${emp.name}">
                <p><strong>Name:</strong> ${emp.name}</p>
                <p><strong>Type:</strong> ${emp.type}</p>
                <p><strong>Route:</strong> ${emp.route || 'N/A'}</p>
                <p><strong>Assigned Property:</strong> ${emp.assignedProperty ? propertiesData.find(p => p.id === emp.assignedProperty)?.propertyName || 'N/A' : 'N/A'}</p>
                <p><strong>Schedule:</strong> ${new Date(emp.schedule.start).toLocaleString()} - ${new Date(emp.schedule.end).toLocaleString()}</p>
                <p><strong>Location:</strong> ${emp.location}</p>
                <p><strong>Department:</strong> ${emp.department}</p>
                <p><strong>Status:</strong> ${emp.status}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="editEmployee('${emp.name}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeleteEmployee('${emp.name}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
            </div>
        `;
    });
    const employeeList = document.getElementById('employeeList');
    if (employeeList) {
        employeeList.innerHTML = html || '<p class="text-center">No employees found.</p>';
    }
}

function confirmDeleteEmployee(name) {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
        deleteEmployee(name);
        showAlert('Employee deleted successfully', 'bg-green-600');
        filterEmployees();
    }
}

function editEmployee(name) {
    const emp = employeesData.find(e => e.name === name);
    if (!emp) return;

    const card = document.getElementById(`employee-${name}`);
    card.innerHTML = `
        <form id="editEmployeeForm-${name}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="name-${name}">Name</label>
                <input type="text" id="name-${name}" value="${emp.name}" class="bg-gray-700 text-white p-2 rounded w-full" readonly>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="type-${name}">Officer Type</label>
                <select id="type-${name}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Patrol" ${emp.type === 'Patrol' ? 'selected' : ''}>Patrol Officer</option>
                    <option value="Static" ${emp.type === 'Static' ? 'selected' : ''}>Static Officer</option>
                </select>
            </div>
            <div class="mb-4 ${emp.type === 'Patrol' ? '' : 'hidden'}" id="routeField-${name}">
                <label class="block text-sm font-medium mb-1" for="route-${name}">Route</label>
                <select id="route-${name}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="">Select Route</option>
                    ${routesData.map(route => `<option value="${route.id}" ${emp.route === route.id ? 'selected' : ''}>${route.name}</option>`).join('')}
                </select>
            </div>
            <div class="mb-4 ${emp.type === 'Static' ? '' : 'hidden'}" id="propertyField-${name}">
                <label class="block text-sm font-medium mb-1" for="assignedProperty-${name}">Assigned Property</label>
                <select id="assignedProperty-${name}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="">Select Property</option>
                    ${propertiesData.map(prop => `<option value="${prop.id}" ${emp.assignedProperty === prop.id ? 'selected' : ''}>${prop.propertyName}</option>`).join('')}
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="start-${name}">Schedule Start</label>
                <input type="datetime-local" id="start-${name}" value="${emp.schedule.start.slice(0, 16)}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="end-${name}">Schedule End</label>
                <input type="datetime-local" id="end-${name}" value="${emp.schedule.end.slice(0, 16)}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="location-${name}">Location</label>
                <input type="text" id="location-${name}" value="${emp.location}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="department-${name}">Department</label>
                <select id="department-${name}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="Supervisors" ${emp.department === 'Supervisors' ? 'selected' : ''}>Supervisors</option>
                    <option value="Officers" ${emp.department === 'Officers' ? 'selected' : ''}>Officers</option>
                    <option value="Dispatchers" ${emp.department === 'Dispatchers' ? 'selected' : ''}>Dispatchers</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="status-${name}">Status</label>
                <select id="status-${name}" class="bg-gray-700 text-white p-2 rounded w-full">
                    <option value="10-8" ${emp.status === '10-8' ? 'selected' : ''}>10-8</option>
                    <option value="10-6" ${emp.status === '10-6' ? 'selected' : ''}>10-6</option>
                    <option value="10-42" ${emp.status === '10-42' ? 'selected' : ''}>10-42</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="filterEmployees()" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const typeSelect = document.getElementById(`type-${name}`);
    const routeField = document.getElementById(`routeField-${name}`);
    const propertyField = document.getElementById(`propertyField-${name}`);
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Patrol') {
            routeField.classList.remove('hidden');
            propertyField.classList.add('hidden');
        } else {
            routeField.classList.add('hidden');
            propertyField.classList.remove('hidden');
        }
    });

    const form = document.getElementById(`editEmployeeForm-${name}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            type: document.getElementById(`type-${name}`).value,
            route: document.getElementById(`type-${name}`).value === 'Patrol' ? document.getElementById(`route-${name}`).value : '',
            assignedProperty: document.getElementById(`type-${name}`).value === 'Static' ? document.getElementById(`assignedProperty-${name}`).value : '',
            schedule: {
                start: new Date(document.getElementById(`start-${name}`).value).toISOString(),
                end: new Date(document.getElementById(`end-${name}`).value).toISOString()
            },
            location: document.getElementById(`location-${name}`).value,
            department: document.getElementById(`department-${name}`).value,
            status: document.getElementById(`status-${name}`).value
        };
        updateEmployee(name, updates);
        showAlert('Employee updated successfully', 'bg-green-600');
        filterEmployees();
    });
}

function addNewRoute() {
    const newId = `Route-${(routesData.length + 1).toString().padStart(2, '0')}`;
    const managerContent = document.getElementById('managerContent');
    managerContent.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Add New Route</h3>
        <form id="addRouteForm" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="routeName">Route Name</label>
                <input type="text" id="routeName" class="bg-gray-700 text-white p-2 rounded w-full" placeholder="Enter route name">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Properties</label>
                <div class="flex flex-wrap gap-4">
                    ${propertiesData.map(p => `<label><input type="checkbox" value="${p.id}"> ${p.propertyName}</label>`).join('')}
                </div>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Add Route</button>
                <button type="button" onclick="showManagerTab('routes')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById('addRouteForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const routeName = document.getElementById('routeName').value;
        const selectedProperties = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
        const newRoute = { id: newId, name: routeName, propertyIds: selectedProperties };
        addRoute(newRoute);
        showAlert('Route added successfully', 'bg-green-600');
        showManagerTab('routes');
    });
}

function filterRoutes() {
    const search = document.getElementById('routeSearch')?.value.toLowerCase() || '';
    const routes = routesData.filter(r => r.name.toLowerCase().includes(search));
    let html = '';
    routes.forEach(route => {
        const properties = route.propertyIds.map(id => propertiesData.find(p => p.id === id)?.propertyName || 'Unknown').join(', ');
        html += `
            <div class="bg-gray-700 p-3 rounded shadow" id="route-${route.id}">
                <p><strong>Route Name:</strong> ${route.name}</p>
                <p><strong>Properties:</strong> ${properties}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="editRoute('${route.id}')" class="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-sm shadow">Edit</button>
                    <button onclick="confirmDeleteRoute('${route.id}')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button>
                </div>
            </div>
        `;
    });
    const routeList = document.getElementById('routeList');
    if (routeList) {
        routeList.innerHTML = html || '<p class="text-center">No routes found.</p>';
    }
}

function editRoute(id) {
    const route = routesData.find(r => r.id === id);
    if (!route) return;

    const managerContent = document.getElementById('managerContent');
    managerContent.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Edit Route</h3>
        <form id="editRouteForm-${id}" class="edit-form">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1" for="routeName-${id}">Route Name</label>
                <input type="text" id="routeName-${id}" value="${route.name}" class="bg-gray-700 text-white p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Properties</label>
                <div class="flex flex-wrap gap-4">
                    ${propertiesData.map(p => `<label><input type="checkbox" value="${p.id}" ${route.propertyIds.includes(p.id) ? 'checked' : ''}> ${p.propertyName}</label>`).join('')}
                </div>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="bg-green-600 hover:bg-green-700 p-2 rounded shadow">Save</button>
                <button type="button" onclick="showManagerTab('routes')" class="bg-gray-600 hover:bg-gray-700 p-2 rounded shadow">Cancel</button>
            </div>
        </form>
    `;

    const form = document.getElementById(`editRouteForm-${id}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedName = document.getElementById(`routeName-${id}`).value;
        const selectedProperties = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
        updateRoute(id, { name: updatedName, propertyIds: selectedProperties });
        showAlert('Route updated successfully', 'bg-green-600');
        showManagerTab('routes');
    });
}

function confirmDeleteRoute(id) {
    if (confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
        deleteRoute(id);
        showAlert('Route deleted successfully', 'bg-green-600');
        filterRoutes();
    }
}
