import { useState, useEffect } from "react";
import "./App.css";
import LoadingOverlay from "react-loading-overlay-ts";
import Modal from "react-modal";

import arrowImg from "./arrow-up.png";

import ParkingSlots from "./components/ParkingSlot";
import FunctionForms from "./components/FunctionForms";

const baseUrl = "http://localhost:5000";

Modal.setAppElement("#root");

function App() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUnparkModal, setShowUnparkModal] = useState(false);
  const [unparkedVehicle, setUnparkedVehicle] = useState();

  const getParkingSlots = () => {
    fetch(`${baseUrl}/parking/slots`)
      .then((res) => res.json())
      .then((res) => {
        setSlots(res);
      });
  };

  useEffect(() => {
    getParkingSlots();
  }, []);

  // useEffect(() => {
  //   console.log("unparked vehicle data", unparkedVehicle);
  // }, [unparkedVehicle]);

  const onParkVehicle = (data) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(`${baseUrl}/parking/vehicle/park`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("item", res);
        getParkingSlots();
        setLoading(false);
        alert(
          `Success! Vehicle ${res.plateNumber} Parking at slot ${res.parkingSlot.name}.`
        );
      });
  };

  const onUnparkVehicle = (data) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(`${baseUrl}/parking/vehicle/unpark`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("unparked", res);
        if (res.success) {
          getParkingSlots();
          setUnparkedVehicle(res);
          setLoading(false);
          setShowUnparkModal(true);
        } else {
          setLoading(false);
          alert(`Error: ${res.message}`);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log("error: ", e.message);
        alert(`Error: ${e.toString()}`);
      });
  };

  const renderSlotByZone = (zone, direction = "row") => {
    if (slots.length <= 0) {
      return null;
    }
    const zoneSlots = slots.filter((o) => o.zone === zone);
    console.log("zone", zoneSlots);
    if (zoneSlots && zoneSlots.length > 0) {
      return (
        <>
          {zoneSlots.map((slot) => (
            <ParkingSlots
              key={slot._id}
              data={slot}
              name={slot.name}
              slotType={slot.slotType}
              direction={direction}
              isOccupied={slot.status === 0 ? false : true}
            />
          ))}
        </>
      );
    }
  };

  return (
    <div className="App">
      <LoadingOverlay active={loading} text="Loading...">
        <div className="appContainer">
          <FunctionForms
            onParkVehicle={onParkVehicle}
            onUnparkVehicle={onUnparkVehicle}
          />
          <div className="parkingLot">
            <div className="roadHorizontal" />
            <div className="frame">
              <div className="colParkingContainer">{renderSlotByZone(1)}</div>
              <div className="roadVertical" />
              <div className="colParkingContainer">{renderSlotByZone(2)}</div>
              <div className="colParkingContainer">{renderSlotByZone(3)}</div>
              <div className="roadVertical" />
              <div className="parkingRow">
                <div className="rowParkingContainer">
                  {renderSlotByZone(4, "column")}
                </div>
                <div className="rowParkingContainer">
                  {renderSlotByZone(5, "column")}
                </div>
                <div className="roadHorizontal" />
                <div className="rowParkingContainer">
                  {renderSlotByZone(6, "column")}
                </div>
              </div>
            </div>
            <div className="roadHorizontal" />
            <div id="EP1" className="entryPoint">
              <img
                src={arrowImg}
                id="EP1Arrow"
                className="arrowImg"
                alt="Arrow Icon"
              />
              <p>Entry Point 1</p>
            </div>
            <div id="EP2" className="entryPoint">
              <img
                src={arrowImg}
                id="EP2Arrow"
                className="arrowImg"
                alt="Arrow Icon"
              />
              <p>Entry Point 2</p>
            </div>
            <div id="EP3" className="entryPoint">
              <img
                src={arrowImg}
                id="EP3Arrow"
                className="arrowImg"
                alt="Arrow Icon"
              />
              <p>Entry Point 3</p>
            </div>
          </div>
        </div>
        <Modal
          isOpen={showUnparkModal}
          onRequestClose={() => setShowUnparkModal(false)}
          shouldCloseOnOverlayClick={false}
          style={modalCustomStyles}
        >
          <h2>Vehicle Unparked</h2>
          <h4>
            Parking Slot:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? unparkedVehicle.vehicle.parkingSlot.name
              : ""}
          </h4>
          <p>
            Plate Number:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? unparkedVehicle.vehicle.plateNumber
              : ""}
          </p>
          <p>
            Vehicle Type:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? unparkedVehicle.vehicle.vehicleType
              : ""}
          </p>
          <p>
            Entry Point:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? unparkedVehicle.vehicle.entryPoint
              : ""}
          </p>
          <p>
            Parked Time:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? new Date(unparkedVehicle.vehicle.parkedTime).toString()
              : ""}
          </p>
          <p>
            Unparked Time:{" "}
            {unparkedVehicle && unparkedVehicle.vehicle
              ? new Date(unparkedVehicle.vehicle.unparkedTime).toString()
              : ""}
          </p>

          <h5 style={{ margin: 0, marginTop: 30 }}>Charges:</h5>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <div>Flat rate: </div>
              <div>{`Excess hours: (${
                unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.excessPerHour.value
                  : 0
              }hrs)`}</div>
              <div>{`Full 24hrs Chunk: (${
                unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.full24HourChunk.value
                  : 0
              })`}</div>
              <div>Total:</div>
            </div>
            <div style={{ textAlign: "right", marginLeft: 50 }}>
              <div>
                {unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.flatRate
                  : ""}
              </div>
              <div>
                {unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.excessPerHour.total
                  : ""}
              </div>
              <div>
                {unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.full24HourChunk.total
                  : ""}
              </div>
              <div>
                {unparkedVehicle && unparkedVehicle.fee
                  ? unparkedVehicle.fee.total
                  : ""}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              style={{ marginTop: 50, backgroundColor: "red", color: "white" }}
              onClick={() => setShowUnparkModal(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </LoadingOverlay>
    </div>
  );
}

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default App;
