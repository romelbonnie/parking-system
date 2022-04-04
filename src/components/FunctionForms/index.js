import "./style.css";
import { useState } from "react";

function FunctionForms({ onParkVehicle, onUnparkVehicle }) {
  // for parking
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("S");
  const [entryPoint, setEntryPoint] = useState("EP1");
  // for unparking
  const [unparkPlateNumber, setUnparkPlateNumber] = useState("");
  const [unparkHours, setUnparkHours] = useState();

  const handleOnParkVehicle = (event) => {
    const data = { plateNumber, vehicleType, entryPoint };
    onParkVehicle(data);
    setPlateNumber("");
    event.preventDefault();
  };

  const handleOnUnparkVehicle = (event) => {
    event.preventDefault();
    if (!unparkPlateNumber || unparkPlateNumber === "") {
      alert("Please enter vehicle plate number to unpark!");
      return;
    }

    const data = { plateNumber: unparkPlateNumber };
    if (unparkHours && unparkHours !== 0) {
      data.hours = unparkHours;
    }
    onUnparkVehicle(data);
    setUnparkPlateNumber("");
    setUnparkHours(null);
  };

  return (
    <div className="formWrapper">
      <form style={{ flex: 1 }} onSubmit={handleOnParkVehicle}>
        <div className="formContainer">
          <h3>Park Vehicle:</h3>
          <div>
            <span>Vehicle Plate Number: </span>
            <input
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </div>
          <div>
            <span>Vehicle Type: </span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="S">Small (S)</option>
              <option value="M">Medium (M)</option>
              <option value="L">Large (L)</option>
            </select>
          </div>
          <div>
            <span>Entry Point: </span>
            <select
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value)}
            >
              <option value="EP1">EP 1</option>
              <option value="EP2">EP 2</option>
              <option value="EP3">EP 3</option>
            </select>
          </div>
          <input type="submit" className="submitBtn" value="Park Vehicle" />
        </div>
      </form>

      <form style={{ flex: 1 }} onSubmit={handleOnUnparkVehicle}>
        <div className="formContainer">
          <h3>Unpark Vehicle:</h3>
          <div>
            <span>Vehicle Plate Number: </span>
            <input
              value={unparkPlateNumber}
              onChange={(e) => setUnparkPlateNumber(e.target.value)}
            />
          </div>
          <div>
            <span>Hours: </span>
            <input
              type="number"
              value={unparkHours}
              onChange={(e) => setUnparkHours(e.target.value)}
            />
          </div>
          <input
            type="submit"
            className="submitBtn"
            style={{ backgroundColor: "#c12f08" }}
            value="Unpark Vehicle"
          />
        </div>
      </form>
    </div>
  );
}

export default FunctionForms;
