// dashboard.js
function initializeDashboard() {
    console.log('Dashboard initialized');
    updateUnitsList();
    updateDispatchList();
}

function updateUnitsList() {
    const unitFilter = document.getElementById('unitFilter')?.value || '';
    const unitsList = document.getElementById('unitsList');
    if (!unitsList) return;

    let html = '';
    const filteredEmployees = employeesData.filter(emp => 
        unitFilter === '' || emp.department === unitFilter
    );

    filteredEmployees.forEach(emp => {
        const isOnline = usersData.some(u => u.username === emp.name);
        const statusColor = isOnline ? 'text-green-500' : 'text-red-500';
        html += `
            <div class="bg-gray-700 p-3 rounded shadow mb-2">
                <p><strong class="${statusColor}">${emp.name}</strong></p>
                <p><strong>Department:</strong> ${emp.department}</p>
                <p><strong>Status:</strong> ${emp.status || 'Offline'}</p>
                <p><strong>Location:</strong> ${emp.location}</p>
            </div>
        `;
    });

    unitsList.innerHTML = html || '<p class="text-center">No units found.</p>';
}

function updateDispatchList() {
    const dispatchList = document.getElementById('dispatchList');
    if (!dispatchList) return;

    const activeDispatches = dispatchData.filter(d => d.status !== 'Completed');
    let html = '';

    if (activeDispatches.length) {
        activeDispatches.forEach(disp => {
            const statusColor = {
                Pending: 'text-yellow-500',
                Assigned: 'text-blue-500',
                'In Progress': 'text-orange-500',
                Completed: 'text-green-500'
            }[disp.status];
            html += `
                <div class="bg-gray-700 p-3 rounded shadow mb-2">
                    <p><strong>Issue:</strong> ${disp.issue}</p>
                    <p><strong>Property:</strong> ${disp.property}</p>
                    <p><strong>Priority:</strong> ${disp.priority}</p>
                    <p><strong>Officer:</strong> ${disp.assignedOfficer || 'Unassigned'}</p>
                    <p><strong>Status:</strong> <span class="${statusColor}">${disp.status}</span></p>
                    <p><strong>Call Time:</strong> ${new Date(disp.dateTime).toLocaleString()}</p>
                </div>
            `;
        });
    } else {
        html = '<p class="text-center">No active dispatches.</p>';
    }

    dispatchList.innerHTML = html;
}

window.initializeDashboard = initializeDashboard;
window.updateUnitsList = updateUnitsList;
window.updateDispatchList = updateDispatchList;
