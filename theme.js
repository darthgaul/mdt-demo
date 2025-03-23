// theme.js - Theme management (dark/light mode)

function initializeTheme() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    // Check initial theme from localStorage
    const isLightMode = localStorage.getItem('lightMode') === 'true';
    if (isLightMode) {
        document.body.classList.add('light-mode');
        toggleBtn.querySelector('.theme-icon').textContent = '🌙';
        document.querySelector('.sticky-nav')?.classList.add('light-mode');
    } else {
        toggleBtn.querySelector('.theme-icon').textContent = '☀️';
    }

    // Add toggle event listener
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        toggleBtn.querySelector('.theme-icon').textContent = isLightMode ? '🌙' : '☀️';
        document.querySelector('.sticky-nav')?.classList.toggle('light-mode', isLightMode);
        localStorage.setItem('lightMode', isLightMode);
    });
}
