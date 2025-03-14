let isInitialized = false;

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.log('No user found, redirecting to login.html');
        if (window.location.pathname.split('/').pop() !== 'login.html') {
            window.location.href = 'login.html';
        }
        return true;
    }
    return false;
}

function updateOfficerStatus(officerName, newStatus, currentUser) {
    if (!currentUser) return false;
    const isOfficer = currentUser.group === 'Officers';
    if (isOfficer && officerName !== currentUser.username) {
        showAlert('Officers can only update their own status', 'bg-red-600');
        return false;
    }
    if (['Managers', 'Supervisors', 'Dispatchers'].includes(currentUser.group) || (isOfficer && officerName === currentUser.username)) {
        window.setOfficerStatus(officerName, newStatus);
        showAlert(`Status for ${officerName} updated to ${newStatus}`, 'bg-green-600');
        return true;
    }
    showAlert('Unauthorized to update officer status', 'bg-red-600');
    return false;
}

function navigateToPage(page) {
    history.pushState({ page: page }, '', page);
    loadPageContent(page);
}

function loadPageContent(page) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && page !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    const nav = `
        <nav class="sticky-nav mb-6 p-4 bg-gray-900 rounded-lg shadow">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <div class="hamburger">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <button id="darkModeToggle"></button>
                </div>
                <div class="nav-tabs">
                    <a href="#" data-page="index.html">Dashboard</a>
                    <a href="#" data-page="properties.html">Properties</a>
                    <a href="#" data-page="people.html">People</a>
                    <a href="#" data-page="dispatch.html">Dispatch</a>
                    <a href="#" data-page="reports.html">Reports</a>
                    <a href="#" data-page="officers.html">Officers</a>
                    <a href="#" data-page="manager.html" id="managerLink">Manager</a>
                </div>
                <div class="flex flex-col items-end space-y-2">
                    <span id="userInfo" class="text-sm"></span>
                    <div class="flex items-center space-x-4">
                        <button onclick="logout()" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm shadow">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    let content = '';
    switch (page) {
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
                            <button onclick="showTab('overview')">Overview</button>
                            <button onclick="showTab('route')">Route</button>
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
                    if (!isLoaded) {
                        loadData(() => {
                            isLoaded = true;
                            console.log('index.html: Data loaded successfully');
                            showTab('overview');
                            updateUnitsList();
                            updateDispatchList();
                        });
                    }

                    function toggleSidebar(id) {
                        const sidebar = document.getElementById(id);
                        if (sidebar) sidebar.classList.toggle('active');
                    }

                    function toggleUnitGroup(groupId) {
                        const group = document.getElementById(groupId);
                        if (group) group.classList.toggle('collapsed');
                    }

                    function updateUnitsList() {
                        const filter = document.getElementById('unitFilter')?.value;
                        const onlineUnits = employeesData.filter(emp => {
                            const status = getOfficerStatus(emp.name);
                            return ['10-8', '10-6', '10-100'].includes(status);
                        });
                        const offlineUnits = employeesData.filter(emp => {
                            const status = getOfficerStatus(emp.name);
                            return status === '10-42';
                        });

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
                            unitsList.innerHTML = html || '<p class="text-center">No units found. Data may have failed to load.</p>';
                        }
                    }

                    function updateDispatchList() {
                        if (!dispatchData) {
                            console.error('dispatchData is not loaded');
                            return;
                        }
                        const active = dispatchData.filter(d => d.status !== 'Completed');
                        let html = active.length ? '<table class="w-full text-left"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th></tr>' : '<p class="text-center">No active dispatches.</p>';
                        active.forEach(disp => {
                            const statusColor = { Pending: 'text-yellow-500', Assigned: 'text-blue-500', 'In Progress': 'text-orange-500' }[disp.status] || 'text-gray-500';
                            html += '<tr><td class="p-2">' + disp.issue + '</td><td class="p-2">' + disp.property + '</td><td class="p-2">' + (disp.assignedOfficer || 'Unassigned') + '</td></tr>';
                        });
                        if (active.length) html += '</table>';
                        const dispatchList = document.getElementById('dispatchList');
                        if (dispatchList) {
                            dispatchList.innerHTML = html;
                        }
                    }

                    function showTab(tab) {
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (!user) {
                            window.location.href = 'login.html';
                            return;
                        }

                        const isManagerOrSupervisor = user && ['Managers', 'Supervisors'].includes(user.group);
                        let html = '';

                        if (tab === 'overview') {
                            if (isManagerOrSupervisor) {
                                const activeCalls = dispatchData ? dispatchData.filter(d => d.status !== 'Completed').length : 0;
                                const loggedInOfficers = usersData && employeesData ? usersData.filter(u => employeesData.some(e => e.name === u.username && ['10-8', '10-6', '10-100'].includes(getOfficerStatus(e.name)))).length : 0;
                                html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Active Calls:</strong> ' + activeCalls + '</p></div><div class="bg-gray-700 p-3 rounded shadow"><p><strong>Officers Online:</strong> ' + loggedInOfficers + '</p></div></div>';
                                html += '<h3 class="text-lg font-semibold mb-2">Officer Status</h3>';
                                if (employeesData && employeesData.length > 0) {
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
                                    html += '<p class="text-center">No officer data available.</p>';
                                }
                                setInterval(checkDispatchTimeouts, 60000);
                            } else {
                                const active = dispatchData ? dispatchData.filter(d => d.assignedOfficer === user.username && d.status !== 'Completed') : [];
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
                            const routeNum = officer ? parseInt(officer.route.split('-')[1]) : 5;
                            const hitsPerOfficer = routeNum === 5 ? 40 : (routeNum === 4 ? 50 : 60);
                            const activeProps = propertiesData ? propertiesData.filter(p => !p.suspended) : [];
                            const propsPerOfficer = Math.ceil(activeProps.length / routeNum);
                            const startIdx = employeesData.findIndex(e => e.name === user.username) * propsPerOfficer;
                            const routeProps = activeProps.slice(startIdx, startIdx + propsPerOfficer);

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
                                html += '<p class="text-center">No properties assigned to your route.</p>';
                            }
                        }
                        const dashboardContent = document.getElementById('dashboardContent');
                        if (dashboardContent) {
                            dashboardContent.innerHTML = html;
                        }
                    }

                    function navigate(address) {
                        window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank');
                    }

                    function arrive(propId) {
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
                        const hits = reportsData ? reportsData.filter(r => r.property === propId && r.type === 'Patrol Hit').length : 0;
                        const prop = propertiesData.find(p => p.id === propId);
                        if (hits >= prop.minHits * 2) {
                            const nextProp = propertiesData.find(p => p.id > propId && !p.suspended);
                            if (nextProp) alert('Property ' + prop.propertyName + ' complete! Navigate to ' + nextProp.propertyName + '?');
                            showTab('route');
                        }
                    }

                    function checkDispatchTimeouts() {
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
                    loadData(() => {
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
                    loadData(() => {});

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
                    loadData(() => {
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
                                html += '<select onchange="updateOfficerStatus(\'' + emp.name + '\', this.value, user)" class="bg-gray-700 text-white p-1 rounded">';
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
                    loadData(() => {
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
            content = '<p>Page not found</p>';
    }

    // Inject content into the body, ensuring the navigation bar is included
    document.body.innerHTML = nav + content;
    // Re-initialize scripts or handle dynamic loading
    if (typeof window.initializePage === 'function') {
        window.initializePage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    isInitialized = true;
    console.log('common.js: DOMContentLoaded triggered');

    if (checkAuthentication()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.querySelector('nav.sticky-nav');
    if (nav) {
        loadPageContent(window.location.pathname.split('/').pop() || 'index.html');

        nav.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                navigateToPage(page);
            }
        });
    }

    const managerLink = document.getElementById('managerLink');
    if (managerLink) {
        if (!user || user.group !== 'Managers') {
            managerLink.style.display = 'none';
        }
    }

    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.textContent = user && user.username ? `Logged in as ${user.username}` : 'Logged in as Guest';
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
        toggleBtn.classList.add('relative', 'inline-flex', 'items-center', 'h-6', 'rounded-full', 'w-11', 'transition-colors', 'duration-200');
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
            toggleBtn.classList.remove('bg-gray-700');
            toggleBtn.classList.add('bg-blue-600');
            toggleBtn.querySelector('span').style.transform = 'translateX(1.25rem)';
            label.textContent = 'Light Mode';
        }
    }
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

window.addEventListener('popstate', (e) => {
    const page = e.state ? e.state.page : window.location.pathname.split('/').pop() || 'index.html';
    loadPageContent(page);
});
