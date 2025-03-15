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

// Navigate to a page and update history
function navigateToPage(page) {
    console.log(`Navigating to: ${page}`);
    history.pushState({ page }, '', page);
    loadPageContent(page);
    highlightActiveTab(page);
}

// Highlight the active navigation tab
function highlightActiveTab(page) {
    const navLinks = document.querySelectorAll('.nav-tabs a');
    navLinks.forEach(link => {
        link.classList.remove('text-blue-400');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('text-blue-400');
        }
    });
}

// Load content into the content-area div
function loadPageContent(page) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('Content area not found in DOM');
        return;
    }

    let content = '';
    switch (page) {
        case 'index.html':
            content = '<h3 class="text-xl font-semibold">Dashboard</h3><p>Dashboard content here.</p>';
            break;
        case 'properties.html':
            content = '<h3 class="text-xl font-semibold">Properties</h3><p>Properties list here.</p>';
            break;
        case 'people.html':
            content = '<h3 class="text-xl font-semibold">People</h3><p>People search results here.</p>';
            break;
        case 'dispatch.html':
            content = '<h3 class="text-xl font-semibold">Dispatch</h3><p>Dispatch content here.</p>';
            break;
        case 'reports.html':
            content = '<h3 class="text-xl font-semibold">Reports</h3><p>Reports list here.</p>';
            break;
        case 'officers.html':
            content = '<h3 class="text-xl font-semibold">Officers</h3><p>Officers status here.</p>';
            break;
        case 'manager.html':
            content = '<h3 class="text-xl font-semibold">Manager</h3><p>Manager tools here.</p>';
            break;
        default:
            content = '<p class="text-red-400">Page not found.</p>';
    }
    contentArea.innerHTML = content;
    console.log(`Loaded content for: ${page}`);
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Check authentication
    if (!checkAuthentication()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.getElementById('main-nav');
    if (!nav) {
        console.error('Navigation header not found in DOM');
        return;
    }

    // Set user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.textContent = user ? `Logged in as ${user.username}` : 'Logged in as Guest';
    }

    // Hide manager link if not a manager
    const managerLink = document.getElementById('managerLink');
    if (managerLink && (!user || user.group !== 'Managers')) {
        managerLink.style.display = 'none';
    }

    // Load initial content
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    loadPageContent(currentPage);
    highlightActiveTab(currentPage);

    // Add navigation event listeners
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-page]');
        if (link) {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const page = e.state ? e.state.page : window.location.pathname.split('/').pop() || 'index.html';
    loadPageContent(page);
    highlightActiveTab(page);
});
