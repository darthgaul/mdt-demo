// dashboard.js

function showDashboardTab(tab) {
    const user = JSON.parse(localStorage.getItem('user'));
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
                        html += `
                            <div class="bg-gray-700 p-3 rounded shadow">
                                <p><strong>${prop.propertyName}</strong></p>
                                <p>${prop.address}</p>
                                <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2">Navigate</button>
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
                html += `<h3 class="text-lg font-semibold mb-2">Your Property: ${prop.propertyName}</h3>`;
                html += `
                    <div class="bg-gray-700 p-3 rounded shadow">
                        <p>${prop.address}</p>
                        <button onclick="navigate('${prop.address}')" class="bg-blue-600 hover:bg-blue-700 p-1 rounded text-sm shadow mt-2">Navigate</button>
                    </div>
                `;
            } else {
                html += '<p class="text-center">No property assigned.</p>';
            }
        }
        document.getElementById('dashboardContent').innerHTML = html;
    }
    // Other tabs remain unchanged
}
