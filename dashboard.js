// dashboard.js - Dashboard-specific logic

let isLoaded = false;

if (!isLoaded) {
    console.log('Index: Calling loadData for Dashboard');
    if (typeof loadData === 'function') {
        loadData(() => {
            isLoaded = true;
            console.log('Index: loadData callback executed');
            initializeDashboard();
        });
    } else {
        console.error('Index: loadData not defined, using fallback');
        window.usersData = JSON.parse(localStorage.getItem('users')) || [];
        window.employeesData = JSON.parse(localStorage.getItem('employees')) || [];
        window.dispatchData = JSON.parse(localStorage.getItem('dispatches')) || [];
        window.propertiesData = JSON.parse(localStorage.getItem('properties')) || [];
        window.reportsData = JSON.parse(localStorage.getItem('reports')) || [];
        initializeDashboard();
    }
} else {
    console.log('Index: Data already loaded');
    initializeDashboard();
}

function initializeDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userInfo = document.getElementById('userInfo');
    if (userInfo && user) {
        userInfo.textContent = `Logged in as ${user.username}`;
        const managerLink = document.getElementById('managerLink');
        if (managerLink && user.group !== 'Managers') managerLink.style.display = 'none';
    }

    // Check for new dispatch assignments for officers
    if (user.group === 'Officers') {
        const lastChecked = localStorage.getItem('lastDispatchCheck') ? new Date(localStorage.getItem('lastDispatchCheck')) : null;
        const newDispatches = dispatchData.filter(d => 
            d.assignedOfficer === user.username && 
            d.status !== 'Completed' && 
            (!lastChecked || new Date(d.assignedTime) > lastChecked)
        );
        newDispatches.forEach(disp => {
            showAlert(`You have been assigned to dispatch ${disp.id}: ${disp.issue}`, 'bg-blue-600');
        });
        localStorage.setItem('lastDispatchCheck', new Date().toISOString());
    }
}

function toggleSidebar(id) {
    console.log('Index: Toggling sidebar with id:', id);
    const sidebar = document.getElementById(id);
    if (sidebar) {
        sidebar.classList.toggle('active');
        console.log('Index: Sidebar toggled, new classList:', sidebar.classList.toString());
    } else {
        console.error('Index: Sidebar not found for id:', id);
    }
}

function toggleUnitGroup(groupId) {
    console.log('Index: Toggling unit group with id:', groupId);
    const group = document.getElementById(groupId);
    if (group) {
        group.classList.toggle('collapsed');
        console.log('Index: Unit group toggled, new classList:', group.classList.toString());
    } else {
        console.error('Index: Unit group not found for id:', groupId);
    }
}

function updateUnitsList() {
    console.log('Index: Updating units list');
    const filter = document.getElementById('unitFilter')?.value;
    console.log('Index: Filter value:', filter);
    console.log('Index: employeesData in updateUnitsList:', employeesData);
    const groupedUnits = {};
    employeesData.forEach(emp => {
        const dept = emp.department || 'Other';
        if (!groupedUnits[dept]) groupedUnits[dept] = [];
        groupedUnits[dept].push(emp);
    });

    let html = '';
    Object.keys(groupedUnits).forEach(dept => {
        if (!filter || filter === dept) {
            html += `<div class="unit-group" id="group-${dept}"><h4 onclick="toggleUnitGroup('group-${dept}')">${dept}</h4><div class="unit-list">`;
            groupedUnits[dept].forEach(emp => {
                const isOnline = usersData.some(u => u.username === emp.name);
                const currentTime = new Date();
                const isOnDuty = currentTime >= new Date(emp.schedule.start) && new Date() <= new Date(emp.schedule.end);
                let status = emp.status || 'Offline';
                let statusClass = 'bg-red-500';
                if (isOnline && isOnDuty) {
                    status = emp.status || '10-8';
                    statusClass = 'bg-green-500';
                } else if (isOnline && !isOnDuty) {
                    status = emp.status || '10-42';
                    statusClass = 'bg-gray-500';
                }
                html += `<div class="unit-card"><p><strong>${emp.name}</strong> <span class="status-tag ${statusClass}">${status}</span></p>`;
                html += `<p><strong>Location:</strong> ${emp.location || 'N/A'}</p>`;
                html += `<p><strong>Department:</strong> ${emp.department || 'N/A'}</p>`;
                html += `</div>`;
            });
            html += '</div></div>';
        }
    });
    const unitsList = document.getElementById('unitsList');
    if (unitsList) {
        if (html) {
            console.log('Index: Rendering units list with HTML:', html);
            unitsList.innerHTML = html;
        } else {
            console.log('Index: No units to render, showing empty message');
            unitsList.innerHTML = '<p class="text-center">No units found.</p>';
        }
    } else {
        console.error('Index: unitsList element not found');
    }
}

function updateDispatchList() {
    console.log('Index: Updating dispatch list');
    console.log('Index: dispatchData in updateDispatchList:', dispatchData);
    if (!dispatchData) {
        console.error('Index: dispatchData is not loaded');
        return;
    }
    const active = dispatchData.filter(d => d.status !== 'Completed');
    console.log('Index: Active dispatches:', active);
    let html = active.length ? '<div class="dispatch-table-container"><table class="dispatch-table"><tr><th class="p-2 bg-gray-700">Issue</th><th class="p-2 bg-gray-700">Property</th><th class="p-2 bg-gray-700">Officer</th></tr>' : '<p class="text-center">No active dispatches.</p>';
    active.forEach(disp => {
        html += `<tr>
            <td class="p-2" data-label="Issue">${disp.issue}</td>
            <td class="p-2" data-label="Property">${disp.property}</td>
            <td class="p-2" data-label="Officer">${disp.assignedOfficer || 'Unassigned'}</td>
        </tr>`;
    });
    if (active.length) html += '</table></div>';
    const dispatchList = document.getElementById('dispatchList');
    if (dispatchList) {
        console.log('Index: Rendering dispatch list with HTML:', html);
        dispatchList.innerHTML = html;
    } else {
        console.error('Index: dispatchList element not found');
    }
}

function navigate(address) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
}

function arrive(propId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const report = {
        id: `R${(reportsData.length + 1).toString().padStart(3, '0')}`,
        dateTime: new Date().toISOString(),
        personId: 'N/A',
        property: propId,
        type: 'Patrol Hit',
        narrative: `${user.username} arrived at property`
    };
    addReport(report);
    const hits = reportsData.filter(r => r.property === propId && r.type === 'Patrol Hit').length;
    const prop = propertiesData.find(p => p.id === propId);
    if (hits >= prop.minHits * 2) {
        const nextProp = propertiesData.find(p => p.id > propId && !p.suspended);
        if (nextProp) alert(`Property ${prop.propertyName} complete! Navigate to ${nextProp.propertyName}?`);
        showDashboardTab('route');
    }
}

function checkDispatchTimeouts() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (['Managers', 'Supervisors'].includes(user.group)) {
        dispatchData.forEach(disp => {
            const elapsed = calculateElapsed(disp.dateTime);
            if (elapsed.minutes >= 15 && disp.status !== 'Completed') {
                showAlert(`Dispatch ${disp.id} overdue (${elapsed.minutes}m)`, 'bg-red-600');
            }
        });
    }
}

function calculateElapsed(dateTime) {
    const start = new Date(dateTime);
    const now = new Date();
    const diffMs = now - start;
    const minutes = Math.floor(diffMs / 1000 / 60);
    return { minutes };
}
