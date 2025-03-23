// js/dashboard.js

import { employeesData, dispatchData, propertiesData, reportsData, routesData, addReport } from './data.js';

// Initialize Dashboard-specific logic
function initializeDashboard() {
    console.log('Dashboard initialized');
    startPolling(); // Start polling for real-time updates
}

// Start polling for updates
function startPolling() {
    setInterval(() => {
        updateUnitsList();
        updateDispatchList();
    }, 30000); // Update every 30 seconds
}

// Update the Active Units sidebar
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

// Update the Active Dispatches sidebar
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

// Handle navigation to a property address
function navigate(address) {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// Log a patrol hit when an officer arrives at a property
function arrive(propertyId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showAlert('You must be logged in to log a patrol hit', 'bg-red-600');
        return;
    }

    const newReport = {
        caseNumber: `25-0314${(reportsData.length + 1).toString().padStart(4, '0')}`,
        dateTime: new Date().toISOString(),
        personId: 'N/A',
        property: propertyId,
        type: 'Patrol Hit',
        narrative: `${user.username} arrived at property`,
        officer: user.username
    };

    addReport(newReport);
    showAlert('Patrol hit logged successfully', 'bg-green-600');

    // Refresh the Route tab to update hits done
    showDashboardTab('route');
}

// Show dashboard tab content (handles Patrol and Static officers)
function showDashboardTab(tab) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showAlert('You must be logged in', 'bg-red-600');
        return;
    }

    const employee = employeesData.find(e => e.name === user.username);
    let html = '';

    if (tab === 'route') {
        if (employee.type === 'Patrol') {
            const route = routesData.find(r => r.id === employee.route);
            if (route) {
                html += `<h3 class="text-lg font-semibold mb-2">Your Route: ${route.name}</h3>`;
                html += '<div class="grid grid-cols-1 gap-4">';
                route.propertyIds.forEach(propId => {
                    const prop = propertiesData.find(p => p.id === propId);
                    if (prop) {
                        const hitsDone = reportsData.filter(r => r.property === propId && r.type === 'Patrol Hit').length;
                        html += `
                            <div class="bg-gray-700 p-3 rounded shadow">
                                <p><strong>${prop.propertyName}</strong></p>
                                <p>${prop.address}</p>
                                <p><strong>Hits Done:</strong> ${hitsDone}/${prop.minHits}</p>
                                <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2 mr-2">Navigate</button>
                                <button onclick="arrive('${prop.id}')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow mt-2">Arrived</button>
                            </div>
                        `;
                    }
                });
                html += '</div>';
            } else {
                html += '<p class="text-center">No route assigned.</p>';
            }
        } else if (employee.type === 'Static') {
            const prop = propertiesData.find(p => p.id === employee.assignedProperty);
            if (prop) {
                const hitsDone = reportsData.filter(r => r.property === prop.id && r.type === 'Patrol Hit').length;
                html += `<h3 class="text-lg font-semibold mb-2">Your Property: ${prop.propertyName}</h3>`;
                html += `
                    <div class="bg-gray-700 p-3 rounded shadow">
                        <p>${prop.address}</p>
                        <p><strong>Hits Done:</strong> ${hitsDone}/${prop.minHits}</p>
                        <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2 mr-2">Navigate</button>
                        <button onclick="arrive('${prop.id}')" class="bg-green-600 hover:bg-green-700 p-1 rounded text-sm shadow mt-2">Arrived</button>
                    </div>
                `;
            } else {
                html += '<p class="text-center">No property assigned.</p>';
            }
        }
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.innerHTML = html;
        }
    }
    // Other tabs (like 'overview') are handled in router.js
}
