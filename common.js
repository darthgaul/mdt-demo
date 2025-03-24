// common.js - Shared utility functions
function checkDispatchTimeouts() {
    const now = new Date();
    const dispatchData = window.dispatchData || [];
    dispatchData.forEach(disp => {
        if (disp.status !== 'Completed') {
            const elapsed = (now - new Date(disp.dateTime)) / 1000 / 60; // Minutes
            if (elapsed >= 15) {
                console.log(`Dispatch ${disp.id} is overdue by ${elapsed.toFixed(0)} minutes.`);
            }
        }
    });
}

window.checkDispatchTimeouts = checkDispatchTimeouts;
export { checkDispatchTimeouts };
