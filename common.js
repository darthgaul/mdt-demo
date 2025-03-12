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
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            toggleBtn.textContent = document.body.classList.contains('light-mode') ? 'Toggle Dark Mode' : 'Toggle Light Mode';
            localStorage.setItem('lightMode', document.body.classList.contains('light-mode'));
        });

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
            toggleBtn.textContent = 'Toggle Dark Mode';
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
        alert.className = `fixed top-4 right-4 ${color} text-white p-4 rounded shadow`;
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 3000);
    }
}
