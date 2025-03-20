// header.js - Inject header into pages

document.addEventListener('DOMContentLoaded', () => {
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerDiv.innerHTML = data;
                // Determine the current page for navigation
                const page = window.location.pathname.includes('index.html') ? 'index' : '';
                // Delay initializeNav to ensure DOM is updated
                setTimeout(() => {
                    initializeNav(page);
                }, 0);
            })
            .catch(error => console.error('Error loading header:', error));
    }
});
