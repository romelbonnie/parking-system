import "./style.css";

function ParkingSlots({ direction = "row", data, name, slotType, isOccupied }) {
  // console.log("data slot", data.vehicle);
  return (
    <div
      className={direction === "row" ? "rowSlot" : "colSlot"}
      style={{ backgroundColor: isOccupied ? "#f74747" : "white" }}
    >
      <div className="slotName">{`${name} (${slotType})`}</div>
      {data.vehicle ? (
        <>
          <div className="vehicleData">
            Vehicle:{" "}
            <span style={{ fontWeight: "bold" }}>
              {data.vehicle ? data.vehicle.plateNumber : ""}
            </span>
          </div>
          <div className="vehicleData">
            Parked Time:{" "}
            <span style={{ fontWeight: "bold" }}>
              {data.vehicle.parkedTime}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ParkingSlots;
