// scripts.js - Application initialization

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    // Check for service worker registrations
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log('Service Workers registered:', registrations);
        }).catch(error => {
            console.error('Error checking service worker registrations:', error);
        });
    }
    // Load data and check authentication
    loadData(() => {
        console.log('Data loaded from localStorage');
        checkAuthentication();
    });
});

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.includes('index.html')) {
        console.log('No user logged in, redirecting to login.html');
        window.location.href = 'login.html';
    }
}
