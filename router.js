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
            mainContent.innerHTML = '<h2>Properties</h2><p>Properties content will be implemented here.</p>';
            break;
        case 'people':
            mainContent.innerHTML = '<h2>People</h2><p>People content will be implemented here.</p>';
            break;
        case 'reports':
            mainContent.innerHTML = '<h2>Reports</h2><p>Reports content will be implemented here.</p>';
            break;
        case 'manager':
            mainContent.innerHTML = '<h2>Manager</h2><p>Manager content will be implemented here.</p>';
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
    `;
    // Reinitialize dashboard-specific logic
    initializeDashboard();
    setupDropdownObserver();
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

// Placeholder for dispatch tab content (to be fully implemented)
function showDispatchTab(tab) {
    const dispatchContent = document.getElementById('dispatchContent');
    if (!dispatchContent) return;

    if (tab === 'active') {
        dispatchContent.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Active Dispatches</h3>
            <div class="dispatch-table-container">
                <table class="dispatch-table">
                    <tr>
                        <th class="p-2 bg-gray-700">Issue</th>
                        <th class="p-2 bg-gray-700">Property</th>
                        <th class="p-2 bg-gray-700">Officer</th>
                    </tr>
                    <!-- Active dispatches will be populated here -->
                </table>
            </div>
        `;
        // Fetch and populate active dispatches (to be implemented)
    } else if (tab === 'completed') {
        dispatchContent.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Completed Dispatches</h3>
            <div class="dispatch-table-container">
                <table class="dispatch-table">
                    <tr>
                        <th class="p-2 bg-gray-700">Issue</th>
                        <th class="p-2 bg-gray-700">Property</th>
                        <th class="p-2 bg-gray-700">Officer</th>
                    </tr>
                    <!-- Completed dispatches will be populated here -->
                </table>
            </div>
        `;
        // Fetch and populate completed dispatches (to be implemented)
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
                <button type="submit" class="bg-green-60
