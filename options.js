// ApexCharts options
module.exports = {
    chart: {
        height: 450,
        width: '100%',
        type: 'bar',
        backgroud: '#f4f4f4',
        foreColor: '#333'
    },

    series: [],

    xaxis: {
        categories: []
    },
    plotOptions: {
        bar: {
            horizontal: false
        }
    },
    fill: {
        colors: ['#f44336']
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: '',
        align: "center",
        margin: 20,
        offsetY: 20,
        style: {
            fontSize: "25px"
        }
    }
};
