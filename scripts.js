// scripts.js - App initialization and navigation
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    if (!checkAuthentication()) return;

    const nav = document.querySelector('nav.sticky-nav');
    if (!nav) {
        console.error('Navigation header not found in DOM');
        return;
    }

    nav.innerHTML = `
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <div class="hamburger"><div></div><div></div><div></div></div>
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
            <div class="flex flex-col items-end space-y-2">
                <span id="userInfo" class="text-sm"></span>
                <div class="flex items-center space-x-4">
                    <button onclick="logout()" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm shadow">Logout</button>
                </div>
            </div>
        </div>
    `;

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userInfo').textContent = `Logged in as ${user.username}`;
        const managerLink = document.getElementById('managerLink');
        if (managerLink && user.group !== 'Managers') managerLink.style.display = 'none';
    }

    // Hamburger and dark mode logic remains the same (omitted for brevity)
});
