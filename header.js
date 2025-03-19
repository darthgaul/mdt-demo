// header.js - Inject header into pages

document.addEventListener('DOMContentLoaded', () => {
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerDiv.innerHTML = data;
                // Determine the current page for statusDropdown
                const page = window.location.pathname.includes('index.html') ? 'index' : '';
                initializeNav(page);
            })
            .catch(error => console.error('Error loading header:', error));
    }
});
