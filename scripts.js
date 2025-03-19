// scripts.js - App initialization

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    if (!checkAuthentication()) return;

    // Initialize navigation bar
    initializeNav(window.location.pathname.includes('index.html') ? 'index' : '');
});
