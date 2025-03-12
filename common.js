const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
    const managerLink = document.getElementById('managerLink');
    if (managerLink && user.group !== 'Managers' && user.group !== 'Supervisors' && user.group !== 'Dispatchers') {
        managerLink.style.display = 'none';
    }
    const userInfo = document.getElementById('userInfo');
    if (userInfo) userInfo.textContent = `Logged in as ${user.username}`;

    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.classList.add('relative', 'inline-flex', 'items-center', 'h-6', 'rounded-full', 'w-11', 'bg-gray-700', 'transition-colors', 'duration-200');
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

    // Adjust layout: stack user info above buttons
    const navRight = document.querySelector('nav .flex:last-child');
    if (navRight) {
        navRight.classList.remove('flex', 'space-x-4', 'items-center');
        navRight.classList.add('flex', 'flex-col', 'items-end', 'space-y-2');
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
        alert.className = `fixed top-4 right-4 ${color} text-white p-4 rounded shadow`;
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 3000);
    }
}
