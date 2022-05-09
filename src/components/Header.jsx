import { useRef } from "react";
import Button from "@mui/material/Button";
import styl from "../styles/css/Header.module.css";

const csv = require("csvtojson");

export default function Header({
  selectedHazard,
  setHazardData,
  setHazardSet,
}) {
  const fileInput = useRef(null);

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      readFileContent(file).then((content) => {
        csv()
          .fromString(content)
          .then((jsonObj) => {
            setHazardData(jsonObj);
            let hazardSet = new Set();
            Object.keys(jsonObj[0]).forEach((header) => {
              if (header.includes("_")) {
                const hazardName = header.split("_")[0];
                hazardSet.add(hazardName);
              }
            });
            console.log("setting hz set ", hazardSet);
            setHazardSet(hazardSet);
          });
      });
    }
  }

  function openFileBrowser() {
    fileInput.current.click();
  }

  function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  return (
    <header className={styl.header}>
      <img src="/logo.jpeg" className={styl.logo} alt="Logo" />
      <nav>
        <label htmlFor="uploadCsv" type="button">
          <div>
            <Button variant="contained" onClick={openFileBrowser}>
              Upload CSV
            </Button>
          </div>
        </label>
        <input
          type="file"
          name="csvFile"
          id="uploadCsv"
          onChange={handleFileSelect}
          ref={fileInput}
          style={{ visibility: "hidden", position: "absolute" }}
        />
      </nav>
    </header>
  );
}
