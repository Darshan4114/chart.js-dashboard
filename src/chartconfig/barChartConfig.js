export default function getBarChartConfig({ selectedHazard, labels, data }) {
  return {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: false },
      scales: {
        x: {
          title: {
            display: true,
            text: "S.No.",
            padding: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: selectedHazard,
            padding: 0,
          },
        },
      },
    },

    chartData: {
      labels,
      datasets: [
        {
          label: selectedHazard,
          data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
  };
}
