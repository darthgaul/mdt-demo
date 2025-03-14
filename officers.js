// officers.js
let officerStatuses = JSON.parse(localStorage.getItem('officerStatuses')) || {};

function getOfficerStatus(officerName) {
    return officerStatuses[officerName] || '10-8'; // Default to Available
}

function setOfficerStatus(officerName, status) {
    officerStatuses[officerName] = status;
    localStorage.setItem('officerStatuses', JSON.stringify(officerStatuses));
    broadcastStatusUpdate(officerName, status); // Notify all pages
}

function broadcastStatusUpdate(officerName, status) {
    // This could be enhanced with a custom event or pub/sub system in a full app
    // For now, rely on page reloads or manual updates
    console.log(`Status updated for ${officerName} to ${status}`);
    // In a real app, use a custom event: document.dispatchEvent(new CustomEvent('statusUpdate', { detail: { officerName, status } }));
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

export { getOfficerStatus, setOfficerStatus, broadcastStatusUpdate, officerStatuses };
