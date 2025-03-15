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
    highlightActiveTab(page);
}

function highlightActiveTab(page) {
    const navLinks = document.querySelectorAll('.nav-tabs a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}

function loadPageContent(page) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && page !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    let content = '';
    switch (page) {
        case 'index.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>Overview: See your dispatches or team status. Route: Start your patrol route.</p>
                </div>
                <div class="dashboard-container">
                    <div class="sidebar" id="unitsSidebar">
                        <button class="toggle-sidebar" onclick="toggleSidebar('unitsSidebar')">Toggle Units</button>
                        <h3 class="text-lg font-semibold mb-2">Active Units</h3>
                        <div id="unitsList"></div>
                    </div>
                    <div class="main-content">
                        <div class="flex space-x-4 mb-4">
                            <button onclick="showTab('overview')">Overview</button>
                            <button onclick="showTab('route')">Route</button>
                        </div>
                        <div id="dashboardContent"></div>
                    </div>
                    <div class="sidebar" id="dispatchSidebar">
                        <button class="toggle-sidebar" onclick="toggleSidebar('dispatchSidebar')">Toggle Dispatches</button>
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
                        });
                    }

                    function showTab(tab) {
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (!user) {
                            window.location.href = 'login.html';
                            return;
                        }
                        const dashboardContent = document.getElementById('dashboardContent');
                        if (dashboardContent) {
                            dashboardContent.innerHTML = tab === 'overview' ? '<p>Overview content</p>' : '<p>Route content</p>';
                        }
                    }
                </script>
            `;
            break;
        case 'properties.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>View all properties.</p>
                </div>
                <h3 class="text-xl font-semibold mb-2">Properties</h3>
                <div id="propertiesList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const propertiesList = document.getElementById('propertiesList');
                        if (propertiesList) {
                            propertiesList.innerHTML = '<p>Properties content</p>';
                        }
                    });
                </script>
            `;
            break;
        case 'people.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>Search for people.</p>
                </div>
                <h3 class="text-xl font-semibold mb-2">People Search</h3>
                <div id="peopleResults" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const peopleResults = document.getElementById('peopleResults');
                        if (peopleResults) {
                            peopleResults.innerHTML = '<p>People content</p>';
                        }
                    });
                </script>
            `;
            break;
        case 'dispatch.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>Manage dispatches.</p>
                </div>
                <div class="flex space-x-4 mb-4">
                    <button onclick="showTab('active')">Active</button>
                    <button onclick="showTab('history')">History</button>
                </div>
                <div id="dispatchContent" class="bg-gray-800 p-4 rounded-lg shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const dispatchContent = document.getElementById('dispatchContent');
                        if (dispatchContent) {
                            dispatchContent.innerHTML = '<p>Dispatch content</p>';
                        }
                    });

                    function showTab(tab) {
                        const dispatchContent = document.getElementById('dispatchContent');
                        if (dispatchContent) {
                            dispatchContent.innerHTML = tab === 'active' ? '<p>Active dispatches</p>' : '<p>History dispatches</p>';
                        }
                    }
                </script>
            `;
            break;
        case 'reports.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>Submit and view reports.</p>
                </div>
                <h3 class="text-xl font-semibold mb-2">Reports</h3>
                <div id="reportsList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const reportsList = document.getElementById('reportsList');
                        if (reportsList) {
                            reportsList.innerHTML = '<p>Reports content</p>';
                        }
                    });
                </script>
            `;
            break;
        case 'officers.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>View officer statuses.</p>
                </div>
                <h3 class="text-xl font-semibold mb-2">Officers Status</h3>
                <div id="officersList" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const officersList = document.getElementById('officersList');
                        if (officersList) {
                            officersList.innerHTML = '<p>Officers content</p>';
                        }
                    });
                </script>
            `;
            break;
        case 'manager.html':
            content = `
                <div class="tips">
                    <h4 class="text-lg font-semibold">Tips</h4>
                    <p>Manage properties and employees.</p>
                </div>
                <h3 class="text-xl font-semibold mb-2">Manage</h3>
                <div id="managerContent" class="bg-gray-800 p-4 rounded-lg overflow-x-auto shadow"></div>
                <div id="alert" class="hidden"></div>
                <script>
                    loadData(() => {
                        const managerContent = document.getElementById('managerContent');
                        if (managerContent) {
                            managerContent.innerHTML = '<p>Manager content</p>';
                        }
                    });
                </script>
            `;
            break;
        case 'login.html':
            window.location.href = 'login.html';
            return;
        default:
            content = '<p>Page not found</p>';
    }

    let contentArea = document.getElementById('content-area');
    if (!contentArea) {
        contentArea = document.createElement('div');
        contentArea.id = 'content-area';
        document.body.appendChild(contentArea);
    }
    contentArea.innerHTML = content;
}

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    isInitialized = true;
    console.log('common.js: DOMContentLoaded triggered');

    if (checkAuthentication()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.querySelector('nav.sticky-nav');
    if (nav) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        loadPageContent(currentPage);
        highlightActiveTab(currentPage);

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
    highlightActiveTab(page);
});
