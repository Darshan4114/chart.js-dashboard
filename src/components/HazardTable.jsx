import styl from "../styles/css/HazardTable.module.css";

export default function HazardTable({ data, selectedHazard, selectedRcp }) {
  return (
    <table className={styl.table}>
      <thead>
        <tr>
          <th>S.No.</th>
          <th>{selectedHazard}</th>
        </tr>
      </thead>
      <tbody>
        {data.length &&
          data.map((hz) => (
            <tr>
              <td>{hz.slno}</td>
              <td>{hz[`${selectedHazard}_${selectedRcp}`]}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
