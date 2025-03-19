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

    // Include statusDropdown only for index.html
    const statusDropdownHtml = page === 'index' ? `
        <select id="statusDropdown" class="bg-gray-700 text-white p-1 rounded hidden" onchange="updateStatus()">
            <option value="10-8">10-8 Available</option>
            <option value="10-6">10-6 Busy</option>
            <option value="10-42">10-42 Off Duty</option>
        </select>
    ` : '';

    // Populate navigation bar
    nav.innerHTML = `
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
                <a href="index.html">Dashboard</a>
                <a href="properties.html">Properties</a>
                <a href="people.html">People</a>
                <a href="dispatch.html">Dispatch</a>
                <a href="reports.html">Reports</a>
                <a href="manager.html" id="managerLink">Manager</a>
            </div>
            <div class="flex items-center space-x-4">
                <span id="userInfo" class="text-sm"></span>
                ${statusDropdownHtml}
                <button onclick="logout()" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm shadow">Logout</button>
            </div>
        </div>
    `;

    // Update user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo && user) {
        userInfo.textContent = `Logged in as ${user.username}`;
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

    // Dark mode toggle
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.classList.add('relative', 'inline-flex', 'items-center', 'h-6', 'rounded-full', 'w-11', 'transition-colors', 'duration-200');
        toggleBtn.innerHTML = '<span class="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform"></span>';
        let existingLabel = toggleBtn.parentNode.querySelector('span.ml-2');
        if (!existingLabel) {
            const label = document.createElement('span');
            label.className = 'ml-2 text-sm';
            label.textContent = 'Dark Mode';
            toggleBtn.parentNode.insertBefore(label, toggleBtn.nextSibling);
        }

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLightMode = document.body.classList.contains('light-mode');
            toggleBtn.classList.toggle('bg-blue-600', isLightMode);
            toggleBtn.classList.toggle('bg-gray-700', !isLightMode);
            toggleBtn.querySelector('span').style.transform = isLightMode ? 'translateX(1.25rem)' : 'translateX(0)';
            const label = toggleBtn.parentNode.querySelector('span.ml-2');
            if (label) label.textContent = isLightMode ? 'Light Mode' : 'Dark Mode';
            const nav = document.querySelector('.sticky-nav');
            if (nav) nav.classList.toggle('light-mode', isLightMode);
            localStorage.setItem('lightMode', isLightMode);
        });

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
            toggleBtn.classList.add('bg-blue-600');
            toggleBtn.classList.remove('bg-gray-700');
            toggleBtn.querySelector('span').style.transform = 'translateX(1.25rem)';
            const label = toggleBtn.parentNode.querySelector('span.ml-2');
            if (label) label.textContent = 'Light Mode';
            const nav = document.querySelector('.sticky-nav');
            if (nav) nav.classList.add('light-mode');
        }
    }
}
