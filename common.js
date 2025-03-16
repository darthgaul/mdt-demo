// Sample data for testing
const sampleData = {
    usersData: [
        { username: 'JohnSmith', password: 'john123', group: 'Officers' },
        { username: 'JaneDoe', password: 'jane123', group: 'Managers' }
    ],
    employeesData: [
        { name: 'JohnSmith', route: 'Route-1', location: 'Downtown', department: 'Patrol', schedule: { start: '2025-03-15T08:00:00Z', end: '2025-03-15T16:00:00Z' } },
        { name: 'JaneDoe', route: 'Route-2', location: 'Uptown', department: 'Patrol', schedule: { start: '2025-03-15T09:00:00Z', end: '2025-03-15T17:00:00Z' } }
    ],
    propertiesData: [
        { id: 'PROP001', propertyName: 'Axel Apartments', address: '123 Main St', apt: 'Apt 1', minHits: 3, notes: 'High security area', suspended: false },
        { id: 'PROP002', propertyName: 'Baker Plaza', address: '456 Oak Ave', apt: '', minHits: 2, notes: '', suspended: false }
    ],
    dispatchData: [
        { id: 'D001', issue: 'Suspicious activity', property: 'PROP001', assignedOfficer: 'JohnSmith', status: 'Assigned', dateTime: '2025-03-15T10:00:00Z', assignedTime: '2025-03-15T10:05:00Z', resolveTime: null }
    ],
    reportsData: [
        { id: 'R001', caseNumber: '2503151000', dateTime: '2025-03-15T10:00:00Z', personId: 'P001', property: 'PROP001', type: 'Patrol Hit', narrative: 'JohnSmith: Arrived at property', officer: 'JohnSmith' }
    ],
    peopleData: [
        { id: 'P001', name: 'John Doe', dob: '1990-01-01', status: 'Resident', property: 'PROP001', behavior: 'Friendly', ctnStatus: 'N/A' }
    ]
};

// Initialize global data with sample data if localStorage is empty
let usersData = JSON.parse(localStorage.getItem('users')) || sampleData.usersData;
let employeesData = JSON.parse(localStorage.getItem('employees')) || sampleData.employeesData;
let propertiesData = JSON.parse(localStorage.getItem('properties')) || sampleData.propertiesData;
let dispatchData = JSON.parse(localStorage.getItem('dispatches')) || sampleData.dispatchData;
let reportsData = JSON.parse(localStorage.getItem('reports')) || sampleData.reportsData;
let peopleData = JSON.parse(localStorage.getItem('people')) || sampleData.peopleData;

// Ensure data is saved to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('employees', JSON.stringify(employeesData));
    localStorage.setItem('properties', JSON.stringify(propertiesData));
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
    localStorage.setItem('reports', JSON.stringify(reportsData));
    localStorage.setItem('people', JSON.stringify(peopleData));
}

// Enhanced initializeSampleData function with logging
function initializeSampleData(callback) {
    console.log('initializeSampleData: Starting data load process...');
    console.log('initializeSampleData: Initial state of global arrays:');
    console.log('  usersData:', usersData);
    console.log('  employeesData:', employeesData);
    console.log('  propertiesData:', propertiesData);
    console.log('  dispatchData:', dispatchData);
    console.log('  reportsData:', reportsData);
    console.log('  peopleData:', peopleData);

    // Ensure data is saved to localStorage
    saveDataToLocalStorage();

    console.log('initializeSampleData: Data saved to localStorage');
    console.log('initializeSampleData: Final state of global arrays after load:');
    console.log('  usersData:', usersData);
    console.log('  employeesData:', employeesData);
    console.log('  propertiesData:', propertiesData);
    console.log('  dispatchData:', dispatchData);
    console.log('  reportsData:', reportsData);
    console.log('  peopleData:', peopleData);

    if (callback) {
        console.log('initializeSampleData: Executing callback');
        callback();
    } else {
        console.log('initializeSampleData: No callback provided');
    }
}

// Placeholder functions
function getOfficerStatus(officerName) {
    return localStorage.getItem(`status-${officerName}`) || '10-8';
}

function setOfficerStatus(officerName, status) {
    localStorage.setItem(`status-${officerName}`, status);
}

function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(propertiesData));
}

function saveReports() {
    localStorage.setItem('reports', JSON.stringify(reportsData));
}

function saveDispatch() {
    localStorage.setItem('dispatches', JSON.stringify(dispatchData));
}

function calculateElapsed(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const minutes = Math.floor(diffMs / 1000 / 60);
    return { minutes };
}

// Check if user is authenticated
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.split('/').pop() !== 'login.html') {
        console.log('No user found, redirecting to login.html');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Update officer status
function updateOfficerStatus(officerName, newStatus, currentUser) {
    if (!currentUser) return false;
    const isOfficer = currentUser.group === 'Officers';
    if (isOfficer && officerName !== currentUser.username) {
        showAlert('Officers can only update their own status', 'bg-red-600');
        return false;
    }
    if (['Managers', 'Supervisors', 'Dispatchers'].includes(currentUser.group) || (isOfficer && officerName === currentUser.username)) {
        setOfficerStatus(officerName, newStatus);
        showAlert(`Status for ${officerName} updated to ${newStatus}`, 'bg-green-600');
        return true;
    }
    showAlert('Unauthorized to update officer status', 'bg-red-600');
    return false;
}

// Navigate to a page using hash
function navigateToPage(pagePath) {
    const page = pagePath.replace('.html', '');
    window.location.hash = `#/${page}`;
    loadPageContent(pagePath);
    highlightActiveTab(pagePath);
}

// Highlight the active navigation tab
function highlightActiveTab(pagePath) {
    const navLinks = document.querySelectorAll('.nav-tabs a');
    navLinks.forEach(link => {
        link.classList.remove('active-tab');
        if (link.getAttribute('data-page') === pagePath) {
            link.classList.add('active-tab');
        }
    });
}

// Load content into the content-area div
function loadPageContent(pagePath) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('Content area not found in DOM');
        return;
    }

    let content = '';
    const user = JSON.parse(localStorage.getItem('user'));

    switch (pagePath) {
        case 'index.html':
            content = `
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
                            <option value="">All Units</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <span class="tooltip-text">Filter units by online/offline status</span>
                        </select>
                        <div id="unitsList"></div>
                    </div>
                    <div class="main-content">
                        <div class="flex space-x-4 mb-4">
                            <button onclick="showTab('overview')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow tooltip">
                                Overview
                                <span class="tooltip-text">View team status and active dispatches</span>
                            </button>
                            <button onclick="showTab('route')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow tooltip">
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
                <script>
                    let isLoaded = false;
                    console.log('Index: Checking if data is loaded, isLoaded:', isLoaded);
                    if (!isLoaded) {
                        console.log('Index: Calling initializeSampleData for Dashboard');
                        initializeSampleData(() => {
                            isLoaded = true;
                            console.log('Index: initializeSampleData callback executed, isLoaded:', isLoaded);
                            console.log('Index: employeesData after load:', employeesData);
                            console.log('Index: dispatchData after load:', dispatchData);
                            showTab('overview');
                            updateUnitsList();
                            updateDispatchList();
                        });
                    } else {
                        console.log('Index: Data already loaded, skipping initializeSampleData');
                    }

                    function toggleSidebar(id) {
                        console.log('Index: Toggling sidebar with id:', id);
                        const sidebar = document.getElementById(id);
                        if (sidebar) {
                            sidebar.classList.toggle('active');
                            console.log('Index: Sidebar toggled, new classList:', sidebar.classList.toString());
                        } else {
                            console.error('Index: Sidebar not found for id:', id);
                        }
                    }

                    function toggleUnitGroup(groupId) {
                        console.log('Index: Toggling unit group with id:', groupId);
                        const group = document.getElementById(groupId);
                        if (group) {
                            group.classList.toggle('collapsed');
                            console.log('Index: Unit group toggled, new classList:', group.classList.toString());
                        } else {
                            console.error('Index: Unit group not found for id:', groupId);
                        }
                    }

                    function updateUnitsList() {
                        console.log('Index: Updating units list');
                        const filter = document.getElementById('unitFilter')?.value;
                        console.log('Index: Filter value:', filter);
                        console.log('Index: employeesData in updateUnitsList:', employeesData);
                        const onlineUnits = employeesData.filter(emp => {
                            const status = getOfficerStatus(emp.name);
                            return ['10-8', '10-6', '10-100'].includes(status);
                        });
                        const offlineUnits = employeesData.filter(emp => {
                            const status = getOfficerStatus(emp.name);
                            return status === '10-42';
                        });
                        console.log('Index: Online units:', onlineUnits);
                        console.log('Index: Offline units:', offlineUnits);

                        let html = '';
                        const groups = { Online: onlineUnits, Offline: offlineUnits };

                        Object.keys(groups).forEach(group => {
                            if (!filter || filter === group) {
                                html += '<div class="unit-group" id="group-' + group + '"><h4 onclick="toggleUnitGroup(\'group-' + group + '\')">' + group + '</h4><div class="unit-list">';
                                groups[group].forEach(emp => {
                                    const status = getOfficerStatus(emp.name);
                                    const statusColor = {
                                        '10-8': 'bg-green-500',
                                        '10-6': 'bg-blue-500',
                                        '10-100': 'bg-yellow-500',
                                        '10-42': 'bg-red-500'
                                    }[status] || 'bg-gray-500';
                                    const nameColor = group === 'Online' ? 'text-green-500' : 'text-red-500';
                                    html += '<div class="unit-card"><p><strong class="' + nameColor + '">' + emp.name + '</strong> <span class="status-tag ' + statusColor + '">[' + status + ']</span></p>';
                                    html += '<p><strong>Location:</strong> ' + (emp.location || 'N/A') + '</p>';
                                    html += '<p><strong>Department:</strong> ' + (emp.department || 'N/A') + '</p></div>';
                                });
                                html += '</div></div>';
                            }
                        });

                        const unitsList = document.getElementById('unitsList');
                        if (unitsList) {
                            if (html) {
                                console.log('Index: Rendering units list with HTML:', html);
                                unitsList.innerHTML = html;
                            } else {
                                console.log('Index: No units to render, showing empty message');
                                unitsList.innerHTML = '<p class="text-center">No units found. Data may have failed to load.</p>';
                            }
                        } else {
                            console.error('Index: unitsList element not found');
                        }
                    }

                    function updateDispatchList() {
                        console.log('Index: Updating dispatch list');
                        console.log('Index: dispatchData in updateDispatchList:', dispatchData);
                        if (!dispatchData) {
                            console.error('Index: dispatchData is not loaded');
                            return;
                        }
                        const active = dispatchData.filter(d => d.status !== 'Completed');
                        console.log('Index: Active dispatches:', active);
                        let html = active.length ? '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th></tr>' : '<p class="text-center">No active dispatches.</p>';
                        active.forEach(disp => {
                            const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500' }[disp.status] || 'text-gray-500';
                            html += '<tr><td class="p-2">' + disp.issue + '</td><td class="p-2">' + disp.property + '</td><td class="p-2">' + (disp.assignedOfficer || 'Unassigned') + '</td></tr>';
                        });
                        if (active.length) html += '</table>';
                        const dispatchList = document.getElementById('dispatchList');
                        if (dispatchList) {
                            console.log('Index: Rendering dispatch list with HTML:', html);
                            dispatchList.innerHTML = html;
                        } else {
                            console.error('Index: dispatch Drog: Updating dispatch list');
                            console.log('Index: dispatchData in updateDispatchList:', dispatchData);
                            if (!dispatchData) {
                                console.error('Index: dispatchData is not loaded');
                                return;
                            }
                            const active = dispatchData.filter(d => d.status !== 'Completed');
                            console.log('Index: Active dispatches:', active);
                            let html = active.length ? '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th></tr>' : '<p class="text-center">No active dispatches.</p>';
                            active.forEach(disp => {
                                const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500' }[disp.status] || 'text-gray-500';
                                html += '<tr><td class="p-2">' + disp.issue + '</td><td class="p-2">' + disp.property + '</td><td class="p-2">' + (disp.assignedOfficer || 'Unassigned') + '</td></tr>';
                            });
                            if (active.length) html += '</table>';
                            const dispatchList = document.getElementById('dispatchList');
                            if (dispatchList) {
                                console.log('Index: Rendering dispatch list with HTML:', html);
                                dispatchList.innerHTML = html;
                            } else {
                                console.error('Index: dispatchList element not found');
                            }
                        }

                        function showTab(tab) {
                            console.log('Index: Showing tab:', tab);
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (!user) {
                                console.log('Index: User not logged in, redirecting to login.html');
                                window.location.href = 'login.html';
                                return;
                            }

                            const isManagerOrSupervisor = user && ['Managers', 'Supervisors'].includes(user.group);
                            console.log('Index: isManagerOrSupervisor:', isManagerOrSupervisor);
                            let html = '';

                            if (tab === 'overview') {
                                if (isManagerOrSupervisor) {
                                    const activeCalls = dispatchData ? dispatchData.filter(d => d.status !== 'Completed').length : 0;
                                    const loggedInOfficers = usersData && employeesData ? usersData.filter(u => employeesData.some(e => e.name === u.username && ['10-8', '10-6', '10-100'].includes(getOfficerStatus(e.name)))).length : 0;
                                    console.log('Index: Active calls:', activeCalls, 'Logged-in officers:', loggedInOfficers);
                                    html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Active Calls:</strong> ' + activeCalls + '</p></div><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Officers Online:</strong> ' + loggedInOfficers + '</p></div></div>';
                                    html += '<h3 class="text-lg font-semibold mb-2">Officer Status</h3>';
                                    if (employeesData && employeesData.length > 0) {
                                        console.log('Index: Rendering officer status table with employeesData:', employeesData);
                                        html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Route</th><th class="p-2 bg-gray-700">Start</th><th class="p-2 bg-gray-700">End</th><th class="p-2 bg-gray-700">Status</th></tr>';
                                        employeesData.forEach(emp => {
                                            const status = getOfficerStatus(emp.name);
                                            const isOnline = ['10-8', '10-6', '10-100'].includes(status);
                                            const statusColor = {
                                                '10-8': 'text-green-500',
                                                '10-6': 'text-blue-500',
                                                '10-100': 'text-yellow-500',
                                                '10-42': 'text-red-500'
                                            }[status] || 'text-gray-500';
                                            html += '<tr><td class="p-2 ' + (isOnline ? 'text-green-500' : 'text-red-500') + '">' + emp.name + '</td><td class="p-2">' + emp.route + '</td><td class="p-2">' + new Date(emp.schedule.start).toLocaleTimeString() + '</td><td class="p-2">' + new Date(emp.schedule.end).toLocaleTimeString() + '</td><td class="p-2 ' + statusColor + '">' + status + '</td></tr>';
                                        });
                                        html += '</table>';
                                    } else {
                                        console.log('Index: No employees data available for officer status');
                                        html += '<p class="text-center">No officer data available.</p>';
                                    }
                                    setInterval(checkDispatchTimeouts, 60000);
                                } else {
                                    const active = dispatchData ? dispatchData.filter(d => d.assignedOfficer === user.username && d.status !== 'Completed') : [];
                                    console.log('Index: Active dispatches for user', user.username, ':', active);
                                    html += '<h3 class="text-lg font-semibold mb-2">Your Active Dispatches</h3>';
                                    html += active.length ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' : '<p class="text-center">No active dispatches assigned to you.</p>';
                                    active.forEach(disp => {
                                        const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500', Completed: 'text-green-500' }[disp.status];
                                        html += '<div class="bg-gray-700 p-3 rounded shadow"><p><strong>Issue:</strong> ' + disp.issue + '</p><p><strong>Property:</strong> ' + disp.property + '</p><p><strong>Status:</strong> <span class="' + statusColor + '">' + disp.status + '</span></p></div>';
                                    });
                                    if (active.length) html += '</div>';
                                }
                            } else if (tab === 'route') {
                                const officer = employeesData.find(e => e.name === user.username);
                                console.log('Index: Officer for route:', officer);
                                const routeNum = officer ? parseInt(officer.route.split('-')[1]) : 5;
                                const hitsPerOfficer = routeNum === 5 ? 40 : (routeNum === 4 ? 50 : 60);
                                const activeProps = propertiesData ? propertiesData.filter(p => !p.suspended) : [];
                                const propsPerOfficer = Math.ceil(activeProps.length / routeNum);
                                const startIdx = employeesData.findIndex(e => e.name === user.username) * propsPerOfficer;
                                const routeProps = activeProps.slice(startIdx, startIdx + propsPerOfficer);
                                console.log('Index: Active properties for route:', activeProps);
                                console.log('Index: Route properties:', routeProps);

                                html += '<h3 class="text-lg font-semibold mb-2">Your Route: ' + (officer ? officer.route : 'Unassigned') + ' (' + hitsPerOfficer + ' hits)</h3>';
                                if (routeProps.length > 0) {
                                    html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Address</th><th class="p-2 bg-gray-700">Hits Done</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                                    routeProps.forEach(prop => {
                                        const hitsDone = reportsData ? reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length : 0;
                                        html += '<tr><td class="p-2">' + prop.propertyName + '</td><td class="p-2">' + prop.address + '</td><td class="p-2">' + hitsDone + '/' + prop.minHits + '</td><td class="p-2 space-x-2">';
                                        html += '<button onclick="navigate(\'' + prop.address + '\')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow tooltip">Navigate<span class="tooltip-text">Open Google Maps to navigate to this property</span></button>';
                                        html += '<button onclick="arrive(\'' + prop.id + '\')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow tooltip">Arrived<span class="tooltip-text">Mark arrival and log a patrol hit</span></button>';
                                        html += '</td></tr>';
                                    });
                                    html += '</table>';
                                } else {
                                    console.log('Index: No properties assigned to route');
                                    html += '<p class="text-center">No properties assigned to your route.</p>';
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

                        function navigate(address) {
                            console.log('Index: Navigating to address:', address);
                            window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank');
                        }

                        function arrive(propId) {
                            console.log('Index: Marking arrival for property:', propId);
                            const user = JSON.parse(localStorage.getItem('user'));
                            const report = {
                                id: 'R' + (reportsData.length + 1).toString().padStart(3, '0'),
                                dateTime: new Date().toISOString(),
                                personId: 'N/A',
                                property: propId,
                                type: 'Patrol Hit',
                                narrative: (user ? user.username : 'Unknown') + ' arrived at property'
                            };
                            reportsData.push(report);
                            saveReports();
                            console.log('Index: Report added:', report);
                            console.log('Index: Updated reportsData:', reportsData);
                            const hits = reportsData ? reportsData.filter(r => r.property === propId && r.type === 'Patrol Hit').length : 0;
                            const prop = propertiesData.find(p => p.id === propId);
                            if (hits >= prop.minHits * 2) {
                                const nextProp = propertiesData.find(p => p.id > propId && !p.suspended);
                                if (nextProp) {
                                    console.log('Index: Property complete, prompting to navigate to next:', nextProp);
                                    alert('Property ' + prop.propertyName + ' complete! Navigate to ' + nextProp.propertyName + '?');
                                }
                                showTab('route');
                            }
                        }

                        function checkDispatchTimeouts() {
                            console.log('Index: Checking dispatch timeouts');
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user && ['Managers', 'Supervisors'].includes(user.group)) {
                                if (dispatchData) {
                                    dispatchData.forEach(disp => {
                                        const elapsed = calculateElapsed(disp.dateTime);
                                        const now = new Date();
                                        const dispatchDate = new Date(disp.dateTime);
                                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                        const dispatchDay = new Date(dispatchDate.getFullYear(), dispatchDate.getMonth(), dispatchDate.getDate());
                                        if (elapsed.minutes >= 15 && disp.status !== 'Completed' && today.getTime() === dispatchDay.getTime()) {
                                            showAlert('Dispatch ' + disp.id + ' overdue (' + elapsed.minutes + 'm)', 'bg-red-600');
                                        }
                                    });
                                }
                            }
                        }
                    </script>
                `;
                break;

            case 'properties.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>View all properties. Click underlined names (e.g., "Axel Apartments") for details with map. Suspended properties are managed in Manager page.</p>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Properties</h3>
                    <div id="propertiesList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => {
                            const customProperties = JSON.parse(localStorage.getItem('customProperties') || '[]');
                            customProperties.forEach(prop => {
                                if (!propertiesData.some(p => p.id === prop.id)) propertiesData.push(prop);
                            });

                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">ID</th><th class="p-2 bg-gray-700">Property Name</th><th class="p-2 bg-gray-700">Address</th><th class="p-2 bg-gray-700">Apt</th><th class="p-2 bg-gray-700">Min. Hits</th><th class="p-2 bg-gray-700">Notes</th></tr>';
                            propertiesData.forEach(prop => {
                                const link = (prop.id === 'PROP001' || prop.id === 'PROP002' || prop.id === 'PROP003') ? '<a href="' + prop.id.toLowerCase() + '.html" class="underline">' + prop.propertyName + '</a>' : prop.propertyName;
                                html += '<tr><td class="p-2">' + prop.id + '</td><td class="p-2">' + link + (prop.suspended ? ' (Suspended)' : '') + '</td><td class="p-2">' + prop.address + '</td><td class="p-2">' + prop.apt + '</td><td class="p-2">' + prop.minHits + '</td><td class="p-2">' + prop.notes + '</td></tr>';
                            });
                            html += '</table>';
                            const propertiesList = document.getElementById('propertiesList');
                            if (propertiesList) {
                                propertiesList.innerHTML = html;
                            }
                        });
                    </script>
                `;
                break;

            case 'people.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>Search by Name (e.g., "John Doe"), ID (e.g., "P001"), or use filters (e.g., CTN Status: "CTN Issued", Property: "PROP001"). List is empty until you search.</p>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">People Search</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4 shadow">
                        <p class="text-sm text-gray-400 mb-2">Search by Name, ID, or filters below. Full list not shown by default (demo only). Enter criteria and click Search.</p>
                        <input type="text" id="simpleSearch" placeholder="Name or ID" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/3 mb-2">
                        <div class="flex flex-wrap gap-2">
                            <select id="ctnFilter" class="bg-gray-700 text-white p-2 rounded"><option value="">CTN Status</option><option value="N/A">N/A</option><option value="CTN Issued">CTN Issued</option><option value="VCTW">VCTW</option></select>
                            <select id="behaviorFilter" class="bg-gray-700 text-white p-2 rounded"><option value="">Behavior</option><option value="Friendly">Friendly</option><option value="Cautious">Cautious</option><option value="Hostile">Hostile</option><option value="Unknown">Unknown</option></select>
                            <input type="text" id="propertyFilter" placeholder="Property ID" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/4">
                            <button onclick="searchPeople()" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow">Search</button>
                        </div>
                    </div>
                    <div id="peopleResults" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => {});

                        function searchPeople() {
                            const simple = document.getElementById('simpleSearch').value.toLowerCase();
                            const ctn = document.getElementById('ctnFilter').value;
                            const behavior = document.getElementById('behaviorFilter').value;
                            const property = document.getElementById('propertyFilter').value.toUpperCase();

                            if (!simple && !ctn && !behavior && !property) {
                                const peopleResults = document.getElementById('peopleResults');
                                if (peopleResults) {
                                    peopleResults.innerHTML = '<p class="text-center">Enter search criteria above to see results.</p>';
                                }
                                return;
                            }

                            const filtered = peopleData.filter(person => {
                                const matchesSimple = !simple || person.id.toLowerCase().includes(simple) || person.name.toLowerCase().includes(simple);
                                const matchesCtn = !ctn || person.ctnStatus === ctn;
                                const matchesBehavior = !behavior || person.behavior === behavior;
                                const matchesProperty = !property || person.property === property;
                                return matchesSimple && matchesCtn && matchesBehavior && matchesProperty;
                            });

                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">ID</th><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">DoB</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Behavior</th><th class="p-2 bg-gray-700">CTN Status</th></tr>';
                            if (filtered.length) {
                                filtered.forEach(person => {
                                    const behaviorClass = person.behavior.toLowerCase() + '-text';
                                    const ctnClass = person.ctnStatus === 'CTN Issued' ? 'ctn-active' : (person.ctnStatus === 'VCTW' ? 'vctw-highlight' : '');
                                    const hasReports = reportsData.some(r => r.personId === person.id);
                                    const nameText = hasReports ? '<a href="javascript:showPerson(\'' + person.id + '\')" class="underline">' + person.name + (person.ctnStatus !== 'N/A' ? ' <span class="ctn-icon">⚠️</span>' : '') + '</a>' : person.name;
                                    html += '<tr class="' + ctnClass + '"><td class="p-2">' + person.id + '</td><td class="p-2">' + nameText + '</td><td class="p-2">' + person.dob + '</td><td class="p-2">' + person.status + '</td><td class="p-2">' + person.property + '</td><td class="p-2"><span class="' + behaviorClass + '">' + person.behavior + '</span></td><td class="p-2">' + person.ctnStatus + '</td></tr>';
                                });
                            } else {
                                html += '<tr><td colspan="7" class="p-2 text-center">No results found</td></tr>';
                            }
                            html += '</table>';
                            const peopleResults = document.getElementById('peopleResults');
                            if (peopleResults) {
                                peopleResults.innerHTML = html;
                            }
                        }

                        function showPerson(id) {
                            const person = peopleData.find(p => p.id === id);
                            const reports = reportsData.filter(r => r.personId === id);
                            let html = '<div class="bg-gray-800 p-4 rounded-lg shadow"><img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="' + person.name + '" class="w-32 h-32 rounded mb-4"><p><strong>Name:</strong> ' + person.name + '</p><p><strong>DoB:</strong> ' + person.dob + '</p><p><strong>Status:</strong> ' + person.status + '</p><p><strong>Property:</strong> ' + person.property + '</p><p><strong>Behavior:</strong> ' + person.behavior + '</p><p><strong>CTN Status:</strong> ' + person.ctnStatus + '</p>';
                            html += '<h4 class="text-lg font-semibold mt-4">Reports</h4><table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Case Number</th><th class="p-2 bg-gray-700">Date/Time</th><th class="p-2 bg-gray-700">Type</th><th class="p-2 bg-gray-700">Narrative</th></tr>';
                            reports.forEach(r => html += '<tr><td class="p-2">' + r.caseNumber + '</td><td class="p-2">' + r.dateTime + '</td><td class="p-2">' + r.type + '</td><td class="p-2">' + r.narrative + '</td></tr>');
                            html += '</table></div>';
                            const peopleResults = document.getElementById('peopleResults');
                            if (peopleResults) {
                                peopleResults.innerHTML = html;
                            }
                        }
                    </script>
                `;
                break;

            case 'dispatch.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>Active: View and manage current calls (assign officers, mark clear). History: See completed calls (restore if needed). Officers see only their assigned calls.</p>
                    </div>
                    <div class="flex space-x-4 mb-4">
                        <button onclick="showTab('active')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Active</button>
                        <button onclick="showTab('history')" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">History</button>
                    </div>
                    <div id="dispatchContent" class="bg-gray-800 p-4 rounded-lg shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => showTab('active'));

                        function showTab(tab) {
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
                                            html += '<tr><td class="p-2">' + disp.issue + '</td><td class="p-2">' + disp.property + '</td><td class="p-2">' + (disp.assignedOfficer || 'Unassigned') + '</td><td class="p-2">' + callTime + '</td><td class="p-2">' + assignedTime + '</td>';
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
                            } else if (tab === 'history') {
                                const completedDispatches = dispatchData ? dispatchData.filter(d => d.status === 'Completed') : [];
                                html += '<h3 class="text-lg font-semibold mb-2">Dispatch History</h3>';
                                if (completedDispatches.length) {
                                    html += '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th><th class="p-2 bg-gray-700">Call Time</th><th class="p-2 bg-gray-700">Assigned Time</th><th class="p-2 bg-gray-700">Resolve Time</th>' + (isDispatcher ? '<th class="p-2 bg-gray-700">Actions</th>' : '') + '</tr>';
                                    completedDispatches.forEach(disp => {
                                        if (!isOfficer || disp.assignedOfficer === user.username) {
                                            const callTime = new Date(disp.dateTime).toLocaleString();
                                            const assignedTime = disp.assignedTime ? new Date(disp.assignedTime).toLocaleString() : 'N/A';
                                            const resolveTime = disp.resolveTime ? new Date(disp.resolveTime).toLocaleString() : 'N/A';
                                            html += '<tr><td class="p-2">' + disp.issue + '</td><td class="p-2">' + disp.property + '</td><td class="p-2">' + (disp.assignedOfficer || 'Unassigned') + '</td><td class="p-2">' + callTime + '</td><td class="p-2">' + assignedTime + '</td><td class="p-2">' + resolveTime + '</td>';
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
                            }
                            const dispatchContent = document.getElementById('dispatchContent');
                            if (dispatchContent) {
                                dispatchContent.innerHTML = html;
                            }
                        }

                        function assignOfficer(select, dispatchId) {
                            const officer = select.value;
                            const dispatch = dispatchData.find(d => d.id === dispatchId);
                            if (dispatch) {
                                dispatch.assignedOfficer = officer || null;
                                dispatch.status = officer ? 'Assigned' : 'Pending';
                                dispatch.assignedTime = officer ? new Date().toISOString() : null;
                                saveDispatch();
                                showTab('active');
                            } else {
                                showAlert('Dispatch not found', 'bg-red-600');
                            }
                        }

                        function clearDispatch(dispatchId) {
                            const dispatch = dispatchData.find(d => d.id === dispatchId);
                            if (dispatch) {
                                dispatch.status = 'Completed';
                                dispatch.resolveTime = new Date().toISOString();
                                saveDispatch();
                                showTab('active');
                            } else {
                                showAlert('Dispatch not found', 'bg-red-600');
                            }
                        }

                        function restoreDispatch(dispatchId) {
                            const dispatch = dispatchData.find(d => d.id === dispatchId);
                            if (dispatch) {
                                dispatch.status = 'Pending';
                                dispatch.resolveTime = null;
                                saveDispatch();
                                showTab('history');
                            } else {
                                showAlert('Dispatch not found', 'bg-red-600');
                            }
                        }
                    </script>
                `;
                break;

            case 'reports.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>Submit a report below (e.g., Patrol Hit, Incident). View all reports in the table. Filter by person via URL (e.g., ?personId=P001). Click Case Number to view details.</p>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Submit Report</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4 shadow">
                        <div class="flex flex-wrap gap-2">
                            <input type="text" id="personId" placeholder="Person ID (e.g., P001)" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/4">
                            <input type="text" id="property" placeholder="Property ID (e.g., PROP001)" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/4">
                            <select id="type" class="bg-gray-700 text-white p-2 rounded"><option value="Patrol Hit">Patrol Hit</option><option value="Incident">Incident</option><option value="CTN Update">CTN Update</option></select>
                            <input type="text" id="narrative" placeholder="Narrative" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/3">
                            <button onclick="submitReport()" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Submit</button>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Reports</h3>
                    <div id="reportsList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => {
                            const urlParams = new URLSearchParams(window.location.search);
                            const personId = urlParams.get('personId');
                            showReports(personId);
                        });

                        function submitReport() {
                            const personId = document.getElementById('personId').value || 'N/A';
                            const property = document.getElementById('property').value;
                            const type = document.getElementById('type').value;
                            const narrative = document.getElementById('narrative').value;

                            if (!property && !narrative) {
                                showAlert('Property or narrative required', 'bg-red-600');
                                return;
                            }

                            const now = new Date();
                            const caseNumber = now.getFullYear().toString().slice(2) + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
                            const user = JSON.parse(localStorage.getItem('user'));
                            const report = {
                                caseNumber,
                                dateTime: now.toISOString(),
                                personId,
                                property,
                                type,
                                narrative: user.username + ': ' + narrative,
                                officer: user.username
                            };
                            if (!reportsData) reportsData = [];
                            reportsData.push(report);
                            saveReports();

                            if (type === 'CTN Update' && personId !== 'N/A') {
                                const person = peopleData.find(p => p.id === personId);
                                if (person) {
                                    person.ctnStatus = 'CTN Issued';
                                }
                            }

                            showAlert('Report submitted', 'bg-green-600');
                            showReports();
                            document.getElementById('personId').value = '';
                            document.getElementById('property').value = '';
                            document.getElementById('narrative').value = '';
                        }

                        function showReports(filterPersonId = null) {
                            const filteredReports = reportsData ? (filterPersonId ? reportsData.filter(r => r.personId === filterPersonId) : reportsData) : [];
                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Case Number</th><th class="p-2 bg-gray-700">Date/Time</th><th class="p-2 bg-gray-700">Person ID</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Type</th><th class="p-2 bg-gray-700">Narrative</th></tr>';
                            if (filteredReports.length) {
                                filteredReports.forEach(report => {
                                    const canView = user.username === report.officer || ['Managers', 'Supervisors'].includes(user.group);
                                    if (canView) {
                                        html += '<tr><td class="p-2"><a href="javascript:showReportDetails(\'' + report.caseNumber + '\')" class="underline">' + report.caseNumber + '</a></td><td class="p-2">' + report.dateTime + '</td><td class="p-2">' + report.personId + '</td><td class="p-2">' + report.property + '</td><td class="p-2">' + report.type + '</td><td class="p-2">' + report.narrative + '</td></tr>';
                                    }
                                });
                            } else {
                                html += '<tr><td colspan="6" class="p-2 text-center">No reports found. Data may have failed to load.</td></tr>';
                            }
                            html += '</table>';
                            const reportsList = document.getElementById('reportsList');
                            if (reportsList) {
                                reportsList.innerHTML = html;
                            }
                        }

                        function showReportDetails(caseNumber) {
                            const report = reportsData.find(r => r.caseNumber === caseNumber);
                            if (!report) {
                                showAlert('Report not found', 'bg-red-600');
                                return;
                            }

                            const isOfficer = user.group === 'Officers' && user.username === report.officer;
                            const isManagerOrSupervisor = ['Managers', 'Supervisors'].includes(user.group);
                            let html = '<div class="bg-gray-800 p-4 rounded-lg shadow">';
                            html += '<h4 class="text-lg font-semibold mb-2">Report Details</h4>';
                            html += '<p><strong>Case Number:</strong> ' + report.caseNumber + '</p>';
                            html += '<p><strong>Date/Time:</strong> ' + report.dateTime + '</p>';
                            html += '<p><strong>Person ID:</strong> ' + report.personId + '</p>';
                            html += '<p><strong>Property:</strong> ' + report.property + '</p>';
                            html += '<p><strong>Type:</strong> ' + report.type + '</p>';
                            html += '<p><strong>Narrative:</strong> ' + report.narrative + '</p>';
                            html += '<p><strong>Officer:</strong> ' + report.officer + '</p>';

                            if (isOfficer || isManagerOrSupervisor) {
                                if (isOfficer) {
                                    const hasRequested = editRequests.some(req => req.caseNumber === caseNumber && req.officer === user.username);
                                    html += '<button onclick="requestEdit(\'' + caseNumber + '\')" class="bg-yellow-600 hover:bg-yellow-700 p-2 rounded shadow mt-2" ' + (hasRequested ? 'disabled' : '') + '>' + (hasRequested ? 'Edit Requested' : 'Request Edit') + '</button>';
                                }
                                if (isManagerOrSupervisor) {
                                    const pendingRequest = editRequests.find(req => req.caseNumber === caseNumber);
                                    if (pendingRequest) {
                                        html += '<div class="mt-2 p-2 bg-yellow-600 rounded"><p><strong>Edit Request from ' + pendingRequest.officer + ':</strong> ' + pendingRequest.reason + '</p>';
                                        html += '<button onclick="approveEdit(\'' + caseNumber + '\', \'' + pendingRequest.officer + '\')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow mr-2">Approve</button>';
                                        html += '<button onclick="denyEdit(\'' + caseNumber + '\', \'' + pendingRequest.officer + '\')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Deny</button></div>';
                                    }
                                }
                            }
                            html += '</div>';
                            const reportsList = document.getElementById('reportsList');
                            if (reportsList) {
                                reportsList.innerHTML = html;
                            }
                        }

                        let editRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');

                        function requestEdit(caseNumber) {
                            const reason = prompt('Reason for edit request:');
                            if (reason) {
                                editRequests.push({ caseNumber, officer: user.username, reason });
                                localStorage.setItem('editRequests', JSON.stringify(editRequests));
                                showAlert('Edit request submitted', 'bg-green-600');
                                showReports();
                            }
                        }

                        function approveEdit(caseNumber, officer) {
                            editRequests = editRequests.filter(req => req.caseNumber !== caseNumber);
                            localStorage.setItem('editRequests', JSON.stringify(editRequests));
                            showAlert('Edit request approved for ' + officer, 'bg-green-600');
                            showReports();
                        }

                        function denyEdit(caseNumber, officer) {
                            editRequests = editRequests.filter(req => req.caseNumber !== caseNumber);
                            localStorage.setItem('editRequests', JSON.stringify(editRequests));
                            showAlert('Edit request denied for ' + officer, 'bg-red-600');
                            showReports();
                        }
                    </script>
                `;
                break;

            case 'officers.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>View all officers and their current status. Update your status (Officers only) or any officer's status (Managers/Supervisors/Dispatchers) using the dropdown.</p>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Officers Status</h3>
                    <div id="officersList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => {
                            showOfficers();
                        });

                        function showOfficers() {
                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Role</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                            if (employeesData && employeesData.length > 0) {
                                employeesData.forEach(emp => {
                                    const userData = usersData.find(u => u.username === emp.name) || {};
                                    const status = getOfficerStatus(emp.name);
                                    const statusColor = {
                                        '10-8': 'text-green-500',
                                        '10-6': 'text-blue-500',
                                        '10-100': 'text-yellow-500',
                                        '10-42': 'text-red-500'
                                    }[status] || 'text-gray-500';
                                    html += '<tr><td class="p-2">' + emp.name + '</td><td class="p-2">' + (userData.role || 'Unknown') + '</td><td class="p-2 ' + statusColor + '">' + status + '</td><td class="p-2">';
                                    html += '<select onchange="updateOfficerStatus(\'' + emp.name + '\', this.value, ' + JSON.stringify(user) + ')" class="bg-gray-700 text-white p-1 rounded">';
                                    const statuses = [
                                        { code: '10-8', label: 'Available' },
                                        { code: '10-6', label: 'Busy' },
                                        { code: '10-100', label: 'Lunch Break' },
                                        { code: '10-42', label: 'Off Duty' }
                                    ];
                                    statuses.forEach(s => {
                                        html += '<option value="' + s.code + '" ' + (status === s.code ? 'selected' : '') + '>' + s.code + ' (' + s.label + ')</option>';
                                    });
                                    html += '</select>';
                                    html += '</td></tr>';
                                });
                            } else {
                                html += '<tr><td colspan="4" class="p-2 text-center">No officers found. Data may have failed to load.</td></tr>';
                            }
                            html += '</table>';
                            const officersList = document.getElementById('officersList');
                            if (officersList) {
                                officersList.innerHTML = html;
                            }
                        }
                    </script>
                `;
                break;

            case 'manager.html':
                content = `
                    <div class="tips">
                        <h4 class="text-lg font-semibold">Tips</h4>
                        <p>Add properties, manage employees (edit group/delete), and suspend/activate properties. All actions require confirmation.</p>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Add Property</h3>
                    <div class="bg-gray-800 p-4 rounded-lg mb-4 shadow">
                        <div class="flex flex-wrap gap-2">
                            <input type="text" id="propId" placeholder="Property ID (e.g., PROP004)" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/4">
                            <input type="text" id="propName" placeholder="Property Name" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/4">
                            <input type="text" id="propAddress" placeholder="Address" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/3">
                            <input type="text" id="propApt" placeholder="Apt" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/6">
                            <input type="number" id="propHits" placeholder="Min Hits" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/6">
                            <input type="text" id="propNotes" placeholder="Notes" class="bg-gray-700 text-white p-2 rounded w-full sm:w-1/3">
                            <button onclick="addProperty()" class="bg-blue-600 hover:bg-blue-700 p-2 rounded shadow">Add</button>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Manage Employees</h3>
                    <div id="employeeList" class="bg-gray-800 p-4 rounded-lg mb-4 shadow overflow-x-auto"></div>
                    <h3 class="text-xl font-semibold mb-2">Manage Properties</h3>
                    <div id="propertyList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                    <div id="alert" class="hidden"></div>
                    <script>
                        initializeSampleData(() => {
                            showEmployees();
                            showProperties();
                        });

                        function addProperty() {
                            const id = document.getElementById('propId').value.toUpperCase();
                            const name = document.getElementById('propName').value;
                            const address = document.getElementById('propAddress').value;
                            const apt = document.getElementById('propApt').value;
                            const hits = parseInt(document.getElementById('propHits').value) || 0;
                            const notes = document.getElementById('propNotes').value;

                            if (!id || !name || !address) {
                                showAlert('ID, Name, and Address are required', 'bg-red-600');
                                return;
                            }
                            if (propertiesData.some(p => p.id === id)) {
                                showAlert('Property ID already exists', 'bg-red-600');
                                return;
                            }

                            const newProp = { id, propertyName: name, address, apt, minHits: hits, notes, suspended: false };
                            propertiesData.push(newProp);
                            let customProps = JSON.parse(localStorage.getItem('customProperties') || '[]');
                            customProps.push(newProp);
                            localStorage.setItem('customProperties', JSON.stringify(customProps));
                            saveProperties();

                            showAlert('Property added', 'bg-green-600');
                            showProperties();
                            document.getElementById('propId').value = '';
                            document.getElementById('propName').value = '';
                            document.getElementById('propAddress').value = '';
                            document.getElementById('propApt').value = '';
                            document.getElementById('propHits').value = '';
                            document.getElementById('propNotes').value = '';
                        }

                        function showEmployees() {
                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Group</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                            if (employeesData && employeesData.length > 0) {
                                employeesData.forEach(emp => {
                                    const userData = usersData.find(u => u.username === emp.name) || {};
                                    html += '<tr><td class="p-2">' + emp.name + '</td><td class="p-2"><select onchange="editGroup(this, \'' + emp.name + '\')" class="bg-gray-700 text-white p-1 rounded">';
                                    ['Managers', 'Supervisors', 'Dispatchers', 'Officers'].forEach(group => {
                                        html += '<option value="' + group + '" ' + (userData.group === group ? 'selected' : '') + '>' + group + '</option>';
                                    });
                                    html += '</select></td><td class="p-2"><button onclick="deleteEmployee(\'' + emp.name + '\')" class="bg-red-600 hover:bg-red-700 p-1 rounded text-sm shadow">Delete</button></td></tr>';
                                });
                            } else {
                                html += '<tr><td colspan="3" class="p-2 text-center">No employees found. Data may have failed to load.</td></tr>';
                            }
                            html += '</table>';
                            const employeeList = document.getElementById('employeeList');
                            if (employeeList) {
                                employeeList.innerHTML = html;
                            }
                        }

                        function showProperties() {
                            let html = '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">ID</th><th class="p-2 bg-gray-700">Name</th><th class="p-2 bg-gray-700">Address</th><th class="p-2 bg-gray-700">Status</th><th class="p-2 bg-gray-700">Actions</th></tr>';
                            if (propertiesData && propertiesData.length > 0) {
                                propertiesData.forEach(prop => {
                                    html += '<tr><td class="p-2">' + prop.id + '</td><td class="p-2">' + prop.propertyName + '</td><td class="p-2">' + prop.address + '</td><td class="p-2">' + (prop.suspended ? 'Suspended' : 'Active') + '</td><td class="p-2">';
                                    html += '<button onclick="' + (prop.suspended ? 'activateProperty' : 'suspendProperty') + '(\'' + prop.id + '\')" class="bg-' + (prop.suspended ? 'green' : 'yellow') + '-600 hover:bg-' + (prop.suspended ? 'green' : 'yellow') + '-700 p-1 rounded text-sm shadow">' + (prop.suspended ? 'Activate' : 'Suspend') + '</button></td></tr>';
                                });
                            } else {
                                html += '<tr><td colspan="5" class="p-2 text-center">No properties found. Data may have failed to load.</td></tr>';
                            }
                            html += '</table>';
                            const propertyList = document.getElementById('propertyList');
                            if (propertyList) {
                                propertyList.innerHTML = html;
                            }
                        }

                        function editGroup(select, name) {
                            if (confirm('Change ' + name + '\'s group to ' + select.value + '?')) {
                                const userData = usersData.find(u => u.username === name);
                                if (userData) {
                                    userData.group = select.value;
                                    localStorage.setItem('users', JSON.stringify(usersData));
                                    showAlert('Group updated for ' + name, 'bg-green-600');
                                }
                            } else {
                                select.value = usersData.find(u => u.username === name).group;
                            }
                        }

                        function deleteEmployee(name) {
                            if (confirm('Delete ' + name + '? This cannot be undone.')) {
                                employeesData = employeesData.filter(e => e.name !== name);
                                usersData = usersData.filter(u => u.username !== name);
                                localStorage.setItem('employees', JSON.stringify(employeesData));
                                localStorage.setItem('users', JSON.stringify(usersData));
                                showAlert(name + ' deleted', 'bg-green-600');
                                showEmployees();
                            }
                        }

                        function suspendProperty(id) {
                            if (confirm('Suspend property ' + id + '?')) {
                                const prop = propertiesData.find(p => p.id === id);
                                if (prop) {
                                    prop.suspended = true;
                                    saveProperties();
                                    showAlert('Property ' + id + ' suspended', 'bg-green-600');
                                    showProperties();
                                }
                            }
                        }

                        function activateProperty(id) {
                            if (confirm('Activate property ' + id + '?')) {
                                const prop = propertiesData.find(p => p.id === id);
                                if (prop) {
                                    prop.suspended = false;
                                    saveProperties();
                                    showAlert('Property ' + id + ' activated', 'bg-green-600');
                                    showProperties();
                                }
                            }
                        }
                    </script>
                `;
                break;

            case 'login.html':
                window.location.href = 'login.html';
                return;

            default:
                content = '<p class="text-red-400">Page not found.</p>';
        }
        contentArea.innerHTML = content;
        console.log(`Loaded content for: ${pagePath}`);
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded');

        if (!checkAuthentication()) return;

        const user = JSON.parse(localStorage.getItem('user'));
        const nav = document.getElementById('main-nav');
        if (!nav) {
            console.error('Navigation header not found in DOM');
            return;
        }

        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = user ? `Logged in as ${user.username}` : 'Logged in as Guest';
        }

        const managerLink = document.getElementById('managerLink');
        if (managerLink && (!user || user.group !== 'Managers')) {
            managerLink.style.display = 'none';
        }

        const hamburger = document.querySelector('.hamburger');
        const navTabs = document.querySelector('.nav-tabs');
        if (hamburger && navTabs) {
            hamburger.addEventListener('click', () => {
                navTabs.classList.toggle('active');
                const isOpen = navTabs.classList.contains('active');
                hamburger.children[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
                hamburger.children[1].style.opacity = isOpen ? '0' : '1';
                hamburger.children[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
            });
        }

        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<span class="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform"></span>';
            const label = document.createElement('span');
            label.className = 'ml-2 text-sm';
            label.textContent = 'Dark Mode';
            toggleBtn.parentNode.insertBefore(label, toggleBtn.nextSibling);

            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const isLightMode = document.body.classList.contains('light-mode');
                toggleBtn.classList.toggle('bg-blue-600', isLightMode);
                toggleBtn.classList.toggle('bg-gray-700', !isLightMode);
                toggleBtn.querySelector('span').style.transform = isLightMode ? 'translateX(1.25rem)' : 'translateX(0)';
                label.textContent = isLightMode ? 'Light Mode' : 'Dark Mode';
                localStorage.setItem('lightMode', isLightMode);
            });

            if (localStorage.getItem('lightMode') === 'true') {
                document.body.classList.add('light-mode');
                toggleBtn.classList.add('bg-blue-600');
                toggleBtn.classList.remove('bg-gray-700');
                toggleBtn.querySelector('span').style.transform = 'translateX(1.25rem)';
                label.textContent = 'Light Mode';
            }
        }

        const hash = window.location.hash.substr(2) || 'index';
        const page = hash + '.html';
        loadPageContent(page);
        highlightActiveTab(page);

        nav.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-page]');
            if (link) {
                e.preventDefault();
                const pagePath = link.getAttribute('data-page');
                navigateToPage(pagePath);
            }
        });
    });

    function logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    function showAlert(message, color = 'bg-green-600') {
        const alert = document.getElementById('alert');
        if (alert) {
            alert.textContent = message;
            alert.className = `fixed bottom-4 right-4 ${color} text-white p-4 rounded shadow z-[1000]`;
            alert.classList.remove('hidden');
            setTimeout(() => alert.classList.add('hidden'), 3000);
        }
    }

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substr(2) || 'index';
        const page = hash + '.html';
        loadPageContent(page);
        highlightActiveTab(page);
    });
