// Global data variables
let peopleData = [];
let propertiesData = [];
let dispatchData = [];
let reportsData = [];
const officers = ['Patrol1', 'Patrol2', 'Patrol3', 'Static1', 'Static2'];

// Load data with error handling
function loadData(callback) {
    Promise.all([
        fetch('people.json').then(res => res.ok ? res.json() : []).catch(err => { console.error('People fetch error:', err); return []; }),
        fetch('properties.json').then(res => res.ok ? res.json() : []).catch(err => { console.error('Properties fetch error:', err); return []; }),
        fetch('dispatch.json').then(res => res.ok ? res.json() : []).catch(err => { console.error('Dispatch fetch error:', err); return []; }),
        fetch('reports.json').then(res => res.ok ? res.json() : []).catch(err => { console.error('Reports fetch error:', err); return []; })
    ]).then(([people, properties, dispatch, reports]) => {
        console.log('Data loaded successfully:', { people, properties, dispatch, reports });
        peopleData = people || [];
        propertiesData = properties || [];
        dispatchData = dispatch || [];
        reportsData = reports || [];
        if (callback) callback();
    }).catch(err => console.error('Promise.all error:', err));
}
