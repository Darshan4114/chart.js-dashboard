import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Bar, Line } from "react-chartjs-2";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

import Header from "./components/Header";
import HazardTable from "./components/HazardTable";

import getHeatMapConfig from "./chartconfig/heatMapConfig";
import getBarChartConfig from "./chartconfig/barChartConfig";
import getLineChartConfig from "./chartconfig/lineChartConfig";

import styl from "./styles/css/App.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  MatrixController,
  MatrixElement
);

export default function App() {
  const [rcpArray, setRcpArray] = useState<any[] | []>([]);
  const [hazardData, setHazardData] = useState<Array<any>>([]);
  const [hazardSet, setHazardSet] = useState<Set<any>>(new Set());
  const [selectedHazard, setSelectedHazard] = useState<string | null>(
    "Temperature"
  );
  const [selectedRcp, setSelectedRcp] = useState<string | null>("85");
  const [barChartConfig, setBarChartConfig] = useState<any | null>(null);
  const [lineChartConfig, setLineChartConfig] = useState<any | null>(null);

  useEffect(() => {
    if (!selectedHazard || !hazardData.length) return;

    const data = hazardData.map((hz) => hz[`${selectedHazard}_${selectedRcp}`]);
    const labels = hazardData.map((hz) => hz.slno);

    const barChartConfig = getBarChartConfig({
      selectedHazard,
      labels,
      data,
    });
    const lineChartConfig = getLineChartConfig({
      selectedHazard,
      labels,
      data,
    });
    const heatMapConfig = getHeatMapConfig({
      selectedHazard,
      hazardData,
    });

    setBarChartConfig(barChartConfig);
    setLineChartConfig(lineChartConfig);

    var heatMap = new ChartJS("heatMap", heatMapConfig as any);
    return () => {
      heatMap.destroy();
    };
  }, [hazardData, selectedHazard, selectedRcp]);

  useEffect(() => {
    //Resetting RCP list on change in selected hazard
    if (!selectedHazard || !hazardData.length) return;
    const csvHeaders = Object.keys(hazardData[0] as object);
    const selectedHazardHeaders = csvHeaders.filter((header) => {
      return header.includes(selectedHazard as any);
    });
    const rcpArr = selectedHazardHeaders.map((hz) => hz.split("_")[1]);
    setRcpArray(rcpArr as any);
  }, [hazardData, selectedHazard]);

  return (
    <div className={styl.container}>
      <Header
        selectedHazard={selectedHazard}
        setHazardData={setHazardData}
        setHazardSet={setHazardSet}
      />
      <main>
        <div className={styl.filters}>
          {hazardSet.size > 0 && (
            <div className={styl.filter}>
              <FormControl>
                <FormLabel id="hazard">Hazard</FormLabel>
                <RadioGroup
                  aria-labelledby="hazard"
                  defaultValue="Temperature"
                  name="hazard"
                  sx={{ marginBottom: "1em" }}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                >
                  {Array.from(hazardSet).map((hz) => {
                    return (
                      <FormControlLabel
                        value={hz}
                        control={<Radio />}
                        label={hz}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </div>
          )}
          {rcpArray.length > 0 && (
            <div className={styl.filter}>
              <FormControl fullWidth>
                <InputLabel id="rcpLabel">RCP</InputLabel>
                <Select
                  labelId="rcpLabel"
                  id="rcp"
                  value={selectedRcp}
                  label="RCP"
                  onChange={(e) => setSelectedRcp(e.target.value)}
                >
                  {rcpArray.map((rcp) => (
                    <MenuItem value={rcp}>{parseInt(rcp) / 10}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>

        <div className={styl.chartList}>
          {/* Bar chart */}
          <div className={styl.chart}>
            {barChartConfig ? (
              <Bar
                options={barChartConfig.options}
                data={barChartConfig.chartData}
                height={400}
                width={600}
              />
            ) : (
              <p>No data. Please upload CSV.</p>
            )}
          </div>

          {/* Heatmap */}
          <div className={styl.chart}>
            {hazardData.length > 0 ? (
              <canvas id="heatMap"></canvas>
            ) : (
              <p>No data. Please upload CSV.</p>
            )}
          </div>

          {/* Hazard table */}
          <div className={styl.chart}>
            {hazardData.length ? (
              <HazardTable
                data={hazardData}
                selectedHazard={selectedHazard}
                selectedRcp={selectedRcp}
              />
            ) : (
              <p>No data. Please upload CSV.</p>
            )}
          </div>

          {/* Line chart */}
          <div className={styl.chart}>
            {lineChartConfig ? (
              <Line
                options={lineChartConfig.options}
                data={lineChartConfig.chartData}
                height={400}
                width={600}
              />
            ) : (
              <p>No data. Please upload CSV.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
