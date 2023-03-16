import { Navigation } from "./models/Navigation";
import { Vec } from "./models/utils/Vector";
import { Visualize } from "./models/utils/Visualize";

const App = document.querySelector("#app") as HTMLElement;
const BuildingsGraphEl = document.querySelector("#BuildingsGraph") as HTMLElement;

const beaconForm = document.getElementById("create-beacon-form") as HTMLFormElement;
const shipForm = document.getElementById("create-ship-form") as HTMLFormElement;
const sendSignalBtn = document.getElementById("signal-send") as HTMLButtonElement;

const [beaconX, beaconY, beaconZ] = beaconForm.elements as any as HTMLInputElement[];
const [shipX, shipY, shipZ] = shipForm.elements as any as HTMLInputElement[];

const BuildingsGraph = await new Visualize(BuildingsGraphEl).init();

export async function Init() {
  const CommandCenter = new Navigation();
  const MainGraph = await new Visualize(App).init();
  MainGraph.addTrace({
    x: Array.from({ length: 1000 }, (_, i) => i),
    y: Array.from({ length: 1000 }, (_, i) => i),
    z: Array.from({ length: 1000 }, (_, i) => (Math.random() * i) / 10 + i),
    mode: "lines+markers",
    marker: {
      color: "rgb(127, 0, 127)",
      size: 5,
      symbol: "circle",
      line: {
        color: "rgb(204, 0, 204)",
        width: 2,
      },
      opacity: 0.8,
    },
    type: "scatter3d",
  });
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
  if (!CommandCenter.beacons?.length) {
    console.log("create");
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
}

Init();
