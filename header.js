// header.js - Inject header into pages

document.addEventListener('DOMContentLoaded', () => {
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        // Directly create the nav element since header.html is removed
        headerDiv.innerHTML = '<nav class="sticky-nav mb-6"></nav>';
        // Determine the current page for navigation
        const page = window.location.pathname.includes('index.html') ? 'index' : '';
        // Delay initializeNav to ensure DOM is updated
        setTimeout(() => {
            initializeNav(page);
        }, 0);
    }
});
