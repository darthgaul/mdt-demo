// common.js - Shared utility functions

import { saveDataToLocalStorage } from './data.js';

function showAlert(message, bgColor) {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `fixed bottom-4 right-4 p-4 rounded shadow ${bgColor} text-white`;
        alert.classList.remove('hidden');
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 3000);
    }
}
