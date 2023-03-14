// import Chart from "chart.js/auto";
import { Navigation } from "./models/Navigation";
import { Vec } from "./models/utils/Vector";
import { Visualize } from "./models/utils/Visualize";

// const App = document.querySelector("#app") as HTMLCanvasElement;
const beaconForm = document.getElementById("create-beacon-form") as HTMLFormElement;
const shipForm = document.getElementById("create-ship-form") as HTMLFormElement;
const shipInfo = document.getElementById("create-ship-info") as HTMLFormElement;
const beaconInfo = document.getElementById("create-beacon-info") as HTMLFormElement;
const sendSignalBtn = document.getElementById("signal-send") as HTMLButtonElement;

const [beaconX, beaconY, beaconZ] = beaconForm.elements as any as HTMLInputElement[];
const [shipX, shipY, shipZ] = shipForm.elements as any as HTMLInputElement[];

export function Init() {
  const CommandCenter = new Navigation();
  const Visual = new Visualize();
  beaconForm.addEventListener("submit", e => {
    e.preventDefault();
    beaconHandler(new Vec(+beaconX.value, +beaconY.value, +beaconZ.value), CommandCenter);
  });

  shipForm.addEventListener("submit", e => {
    e.preventDefault();
    shipHandler(new Vec(+shipX.value, +shipY.value, +shipZ.value), CommandCenter);
  });

  sendSignalBtn.addEventListener("click", () => {
    CommandCenter.initCheck();
    CommandCenter.findCord();
  });
}

function beaconHandler(vector: Vec, CommandCenter: Navigation) {
  const { id } = CommandCenter.createBeacon(vector);
  const record = document.createElement("p");
  record.innerText = `The beacon located on {${vector.cords.join(", ")}}`;
  record.id = id;
  beaconInfo.appendChild(record);
}

function shipHandler(vector: Vec, CommandCenter: Navigation) {
  if (CommandCenter.ship) {
    alert("You can create only one ship");
    return;
  }
  const { id } = CommandCenter.createShip(vector);
  const record = document.createElement("p");
  console.log(vector, +shipX.value, +shipY.value, +shipZ.value);
  record.innerText = `The ship located on: {${vector.cords.join(", ")}}`;
  record.id = id;
  shipInfo.appendChild(record);
}

Init();
