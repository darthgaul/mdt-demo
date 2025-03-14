// officers.js
let officerStatuses = JSON.parse(localStorage.getItem('officerStatuses')) || {};

function getOfficerStatus(officerName) {
    return officerStatuses[officerName] || '10-8'; // Default to Available
}

function setOfficerStatus(officerName, status) {
    officerStatuses[officerName] = status;
    localStorage.setItem('officerStatuses', JSON.stringify(officerStatuses));
    broadcastStatusUpdate(officerName, status);
}

function broadcastStatusUpdate(officerName, status) {
    console.log(`Status updated for ${officerName} to ${status}`);
    // Trigger a custom event to notify other pages (simplified for now)
    window.dispatchEvent(new Event('statusUpdate'));
}

// Initial setup with demo statuses
if (Object.keys(officerStatuses).length === 0) {
    officerStatuses = {
        "TomVega": "10-8",    // Supervisor, Available
        "AlexReed": "10-8",   // Patrol Officer, Available
        "BellaCruz": "10-6",  // Static Officer, Busy
        "SarahJones": "10-100", // Dispatcher, Lunch Break
        "JohnSmith": "10-42"  // Manager, Off Duty
    };
    localStorage.setItem('officerStatuses', JSON.stringify(officerStatuses));
}

// Expose functions globally
window.getOfficerStatus = getOfficerStatus;
window.setOfficerStatus = setOfficerStatus;
window.officerStatuses = officerStatuses;
