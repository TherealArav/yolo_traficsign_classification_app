
let trafficChart;

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    fetchData();
    setInterval(fetchData, 5000);
})
function initChart() {
    const ctx = document.getElementById('trafic-chart').getContext('2d');

    trafficChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Detections',
                data: [], 
                backgroundColor: [
                    '#FF6384', // Red
                    '#36A2EB', // Blue
                    '#FFCE56', // Yellow
                    '#4BC0C0', // Teal
                    '#9966FF', // Purple
                    '#FF9F40'  // Orange
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function fetchData() {
    fetch('/api/dashboard')
        .then(response => response.json())
        .then(data => {
            
            document.getElementById('update-count').textContent = `Total Queries: ${data.total_predictions}`;

            const tableBody = document.getElementById('table-body');
            const items = data.class_count || [];

            // Delete table data
            tableBody.innerHTML = ''
            // Update table data
            items.forEach(item => {
                const image_label = item.label
                const image_count = item.count
                const row = `
                    <tr>
                        <td>${image_label}</td>
                        <td>${image_count}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;

            });
            // Update chart data
            const labels = items.map(item => item.label)
            const counts = items.map(item => item.count)

            trafficChart.data.labels = labels;
            trafficChart.data.datasets[0].data = counts;
            trafficChart.update();

        })
        .catch(error => console.error('Error fetching stats:', error));
}