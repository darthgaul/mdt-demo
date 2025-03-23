// nav.js - Centralized navigation bar setup

function initializeNav(page) {
    const nav = document.querySelector('nav.sticky-nav');
    if (!nav) {
        console.error('Navigation header not found in DOM');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    // Preserve light-mode class if present
    const isLightMode = document.body.classList.contains('light-mode');
    const navClass = isLightMode ? 'sticky-nav light-mode' : 'sticky-nav';

    // Populate navigation bar with three distinct sections
    nav.innerHTML = `
        <div class="nav-left">
            <div class="hamburger">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <button id="darkModeToggle" class="theme-toggle">
                <span class="theme-icon">${isLightMode ? '🌙' : '☀️'}</span>
            </button>
        </div>
        <div class="nav-center">
            <div class="nav-tabs">
                <a href="index.html#dashboard" data-tab="dashboard" class="tab-link">Dashboard</a>
                <a href="index.html#properties" data-tab="properties" class="tab-link">Properties</a>
                <a href="index.html#people" data-tab="people" class="tab-link">People</a>
                <a href="index.html#dispatch" data-tab="dispatch" class="tab-link">Dispatch</a>
                <a href="index.html#reports" data-tab="reports" class="tab-link">Reports</a>
                <a href="index.html#manager" data-tab="manager" id="managerLink" class="tab-link">Manager</a>
            </div>
        </div>
        <div class="nav-right">
            <span id="userInfo" class="text-sm"></span>
            <button onclick="logout()" class="logout-btn">Logout</button>
        </div>
    `;

    // Update user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo && user) {
        userInfo.textContent = `Logged in as ${user.username}`;
    } else if (userInfo) {
        userInfo.textContent = `Logged in as no one`;
    }

    // Hide Manager link for non-managers
    const managerLink = document.getElementById('managerLink');
    if (managerLink && user && user.group !== 'Managers') {
        managerLink.style.display = 'none';
    }

    // Hamburger menu toggle
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

    // Initialize theme (dark mode toggle)
    initializeTheme();

    // Tab navigation (only for index.html)
    if (page === 'index') {
        const navLinks = document.querySelectorAll('.nav-tabs a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                navigateToTab(tab);
                // Update active class
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Set initial active tab
        const currentTab = window.location.hash.replace('#', '') || 'dashboard';
        navigateToTab(currentTab);
        const activeLink = document.querySelector(`.nav-tabs a[data-tab="${currentTab}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
