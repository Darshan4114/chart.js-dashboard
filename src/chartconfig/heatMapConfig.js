export default function getHeatMapConfig({ selectedHazard, hazardData }) {
  /**
   *
   * @returns Array of RCPs related to the selected hazard
   */
  const getRcpArray = () => {
    const csvHeaders = Object.keys(hazardData[0]);
    const selectedHazardHeaders = csvHeaders.filter((header) => {
      return header.includes(selectedHazard);
    });
    const rcpSet = selectedHazardHeaders.map((hz) => hz.split("_")[1]);
    return rcpSet;
  };

  const rcpArray = getRcpArray();

  const heatMapData = [];
  const heatMapRangeArr = [];

  hazardData.forEach((hz, idx) => {
    rcpArray.forEach((rcp, rcpIdx) => {
      heatMapRangeArr.push(hz[`${selectedHazard}_${rcp}`]);
      heatMapData.push({
        x: idx + 1,
        y: parseInt(rcp) / 10,
        selectedHazard: hz[`${selectedHazard}_${rcp}`],
      });
    });
  });

  return {
    type: "matrix",
    data: {
      datasets: [
        {
          label: selectedHazard,
          data: heatMapData,
          borderWidth: 1,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor({ raw }) {
            //Filtering out undefined and null values from csvData
            const validValues = heatMapRangeArr.filter(
              (val) => val !== undefined && val !== null
            );
            const min = Math.min(...validValues);
            const max = Math.max(...validValues);

            if (raw.selectedHazard) {
              const alpha = (raw.selectedHazard - min) / (max - min);
              return `rgba(54, 162, 235, ${alpha})`;
            }
            return `rgb(0,0,0)`;
          },
          width: ({ chart }) =>
            (chart.chartArea || {}).width / hazardData.length - 1,
          height: ({ chart }) =>
            (chart.chartArea || {}).height / rcpArray.length - 1,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            title() {
              return "";
            },
            label(context) {
              const v = context.dataset.data[context.dataIndex];
              return [`${selectedHazard}: ${v.selectedHazard}`];
            },
          },
        },
      },
      scales: {
        x: {
          // display: false,
          min: 0.5,
          max: hazardData.length + 0.5,
          offset: false,
          title: {
            display: true,
            text: "S.No.",
            padding: 0,
          },
        },
        y: {
          type: "category",
          labels: rcpArray.map((rcp) => parseInt(rcp) / 10),
          offset: true,
          ticks: {
            display: true,
          },
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: "RCP",
            padding: 0,
          },
        },
      },
    },
  };
}
