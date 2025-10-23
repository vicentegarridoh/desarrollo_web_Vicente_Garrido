//grafico 1
Highcharts.chart("container", {
  chart: {
    type: "line",
    plotBackgroundColor: '#ffffffff',
    backgroundColor: '#F8F8F8'
  },
  title: {
    text: "Numero de avisos publicados en los ultimos meses",
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      month: "%b %e, %Y",
    },
    title: {
      text: "Fecha",
    },
  },
  yAxis: {
    title: {
      text: "Numero de Avisos",
    },
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },

  tooltip: {
    shared: true,
    crosshairs: true,
  },

  series: [
    {
      name: "Avisos",
      data: [],
      lineWidth: 1,
      marker: {
        enabled: true,
        radius: 4,
      },
      color: "#10b901ff",
    },
  ],
});

fetch("http://127.0.0.1:5000/get-stats-data")
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.map((item) => {
      const [year, month, day] = item.date
        .split("-")
        .map((part) => parseInt(part, 10));
      return [
        Date.UTC(year, month - 1, day), // javascript month indices start from 0 !
        item.count,
      ];
    });

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container"
    );

    // Update the chart with new data
    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));


//grafico 2
  Highcharts.chart('container_2', {
    chart: {
        type: 'pie'
    },
    colors: [
        '#0a8fd6ff', // Un azul profesional (para el primer dato, ej. "Perro")
        '#06998aff', // Un verde azulado/teal (para el segundo dato, ej. "Gato")
    ],
    title: {
        text: 'Total de Avisos de Adopción por Tipo de Mascota'
    },
    series: [{
        name: 'Cantidad',
        colorByPoint: true,
        data: []
    }]
});


fetch("http://127.0.0.1:5000/get-stats-data2")
  .then((response) => response.json())
  .then((data) => {

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container_2"
    );

    // Update the chart with new data
    chart.update({
      series: [
        {
          data: data,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));


  Highcharts.chart('container_3', {
    chart: {
        type: 'column'
    },
    colors: [
        '#06998aff', 
        '#0a8fd6ff'
    ],
    title: {
        text: 'Avisos de Adopción de Gatos y Perros por Mes'
    },
    xAxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo','Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre']
    },
    yAxis: {
        title: {
            text: 'Cantidad de Avisos'
        }
    },
    series: [{
        name: 'Gatos',
        data: [15, 20, 25, 30, 18,15, 20, 25, 30, 18,0,0]
    }, {
        name: 'Perros',
        data: [10, 15, 22, 28, 20,15, 20, 25, 30, 18,0,1]
    }]
});

fetch("http://127.0.0.1:5000/get-stats-data3")
  .then((response) => response.json())
  .then((data) => {

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container_3"
    );

    // Update the chart with new data
    chart.update({
      series: [{
        name: 'Gatos',
        data: data[0]
    }, {
        name: 'Perros',
        data: data[1]
    }]
    });
  })
  .catch((error) => console.error("Error:", error));


