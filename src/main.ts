import { Navigation } from "./models/Navigation";
import { Vec } from "./models/utils/Vector";
import { Visualize } from "./models/utils/Visualize";
import { startDetection, stopDetection } from "./utils/startDetection";
const BuildingsGraphEl = document.querySelector("#BuildingsGraph") as HTMLElement;

const beaconForm = document.getElementById("create-beacon-form") as HTMLFormElement;
const shipForm = document.getElementById("create-ship-form") as HTMLFormElement;
const signalStartBtn = document.getElementById("signal-start") as HTMLButtonElement;
const signalStopBtn = document.getElementById("signal-stop") as HTMLButtonElement;

const [beaconX, beaconY, beaconZ] = beaconForm.elements as any as HTMLInputElement[];
const [shipX, shipY, shipZ] = shipForm.elements as any as HTMLInputElement[];

const BuildingsGraph = await new Visualize(BuildingsGraphEl).init();

export async function Init() {
  const CommandCenter = new Navigation();

  beaconForm.addEventListener("submit", e => {
    e.preventDefault();
    beaconHandler(new Vec(+beaconX.value, +beaconY.value, +beaconZ.value), CommandCenter);
  });

  shipForm.addEventListener("submit", e => {
    e.preventDefault();
    shipHandler(new Vec(+shipX.value, +shipY.value, +shipZ.value), CommandCenter);
  });

  signalStartBtn.addEventListener("click", () => {
    startDetection(CommandCenter);
  });

  signalStopBtn.addEventListener("click", () => {
    stopDetection(CommandCenter);
  });

  // TODO: Delete for manually control from UI
  for (let i = 0; i < 8; i++) {
    beaconHandler(
      new Vec((Math.random() * 100_000) | 0, (Math.random() * 100_000) | 0, (Math.random() * 100_000) | 0),
      CommandCenter
    );
  }

  const shipVec = new Vec(Math.random() * 100, Math.random() * 100, Math.random() * 100);
  shipHandler(shipVec, CommandCenter);
}

function beaconHandler(vector: Vec, CommandCenter: Navigation) {
  [beaconX.value, beaconY.value, beaconZ.value] = ["", "", ""];
  if (!CommandCenter.beacons?.length) {
    BuildingsGraph.addTrace({
      x: [vector.cords[0]],
      y: [vector.cords[1]],
      z: [vector.cords[2]],
      type: "scatter3d",
      mode: "lines+markers",
      name: "Beacons",
      marker: {
        size: 15,
        color: "#0E00CC",
        symbol: "circle",
        line: {
          color: "#0E00CC",
        },
      },
    });
    CommandCenter.createBeacon(vector);
    return;
  }
  const data = {
    x: [[vector.cords[0]]],
    y: [[vector.cords[1]]],
    z: [[vector.cords[2]]],
  };
  BuildingsGraph.extendTrace(data, 0);
  CommandCenter.createBeacon(vector);
}

function shipHandler(vector: Vec, CommandCenter: Navigation) {
  if (!CommandCenter.beacons?.length) return alert("Create at least one beacon");

  if (CommandCenter.ship) {
    alert("You can create only one ship");
    return;
  }
  CommandCenter.createShip(vector);
  BuildingsGraph.addTrace({
    x: [vector.cords[0]],
    y: [vector.cords[1]],
    z: [vector.cords[2]],
    type: "scatter3d",
    mode: "markers",
    name: "Ship",
    marker: { size: 15, color: "#FF0000" },
  });

  [shipX.value, shipY.value, shipZ.value] = ["", "", ""];
}

Init();
