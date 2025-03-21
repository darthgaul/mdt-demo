// scripts.js - Application initialization

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    checkAuthentication();
});

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.includes('index.html')) {
        console.log('No user logged in, redirecting to login.html');
        window.location.href = 'login.html';
    }
}
