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
        setOfficerStatus(officerName, newStatus);
        showAlert(`Status for ${officerName} updated to ${newStatus}`, 'bg-green-600');
        return true;
    }
    showAlert('Unauthorized to update officer status', 'bg-red-600');
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    isInitialized = true;
    console.log('common.js: DOMContentLoaded triggered');

    if (checkAuthentication()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.querySelector('nav.sticky-nav');
    if (nav) {
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
                    <a href="officers.html">Officers</a>
                    <a href="manager.html" id="managerLink">Manager</a>
                </div>
                <div class="flex flex-col items-end space-y-2">
                    <span id="userInfo" class="text-sm"></span>
                    <div class="flex items-center space-x-4">
                        <button onclick="logout()" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm shadow">Logout</button>
                    </div>
                </div>
            </div>
        `;

        // Manager link visibility: Only visible for Managers
        const managerLink = document.getElementById('managerLink');
        if (managerLink) {
            if (!user || user.group !== 'Managers') {
                managerLink.style.display = 'none';
            }
        }

        // Set user info safely
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = user && user.username ? `Logged in as ${user.username}` : 'Logged in as Guest';
        }

        // Hamburger toggle
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

        // Set active tab
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-tabs a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) link.classList.add('active');
        });
    }

    // Expose updateOfficerStatus for use in other pages
    window.updateOfficerStatus = updateOfficerStatus;
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
