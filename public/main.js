var socket = io();

// Initial 'welcome' message
socket.on('hello', (data) => {
    console.log(data);
});

socket.on('reload-graph', (data) => {
    console.log(data);

    // Init chart
    const chart = new ApexCharts(document.querySelector("#chart"), data);

    // Render chart
    chart.render();
});
