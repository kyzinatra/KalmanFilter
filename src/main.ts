import { Navigation } from "./models/Navigation";
import { Vec } from "./models/utils/Vector";
import { Visualize } from "./models/utils/Visualize";
import { startDetection, stopDetection } from "./utils/detection";
const BuildingsGraphEl = document.querySelector("#BuildingsGraph") as HTMLElement;

const recevierForm = document.getElementById("create-recevier-form") as HTMLFormElement;
const aircraftForm = document.getElementById("create-aircraft-form") as HTMLFormElement;
const signalStartBtn = document.getElementById("signal-start") as HTMLButtonElement;
const signalStopBtn = document.getElementById("signal-stop") as HTMLButtonElement;

const [recevierX, recevierY, recevierZ] = recevierForm.elements as any as HTMLInputElement[];
const [aircraftX, aircraftY, aircraftZ] = aircraftForm.elements as any as HTMLInputElement[];

const BuildingsGraph = await new Visualize(BuildingsGraphEl).init();

export async function Init() {
  const CommandCenter = new Navigation();

  recevierForm.addEventListener("submit", e => {
    e.preventDefault();
    recevierHandler(new Vec(+recevierX.value, +recevierY.value, +recevierZ.value), CommandCenter);
  });

  aircraftForm.addEventListener("submit", e => {
    e.preventDefault();
    aircraftHandler(new Vec(+aircraftX.value, +aircraftY.value, +aircraftZ.value), CommandCenter);
  });

  signalStartBtn.addEventListener("click", () => {
    startDetection(CommandCenter);
  });

  signalStopBtn.addEventListener("click", () => {
    stopDetection(CommandCenter);
  });

  // TODO: Delete for manually control from UI
  for (let i = 0; i < 8; i++) {
    recevierHandler(
      new Vec((Math.random() * 100_000) | 0, (Math.random() * 100_000) | 0, (Math.random() * 100_000) | 0),
      CommandCenter
    );
  }

  const aircraftVec = new Vec(Math.random() * 100, Math.random() * 100, Math.random() * 100);
  aircraftHandler(aircraftVec, CommandCenter);
}

function recevierHandler(vector: Vec, CommandCenter: Navigation) {
  [recevierX.value, recevierY.value, recevierZ.value] = ["", "", ""];
  if (!CommandCenter.receviers?.length) {
    BuildingsGraph.addTrace({
      x: [vector.coords[0]],
      y: [vector.coords[1]],
      z: [vector.coords[2]],
      type: "scatter3d",
      mode: "lines+markers",
      name: "Receivers",
      marker: {
        size: 15,
        color: "#0E00CC",
        symbol: "circle",
        line: {
          color: "#0E00CC",
        },
      },
    });
    CommandCenter.createReceiver(vector);
    return;
  }
  const data = {
    x: [[vector.coords[0]]],
    y: [[vector.coords[1]]],
    z: [[vector.coords[2]]],
  };
  BuildingsGraph.extendTrace(data, 0);
  CommandCenter.createReceiver(vector);
}

function aircraftHandler(vector: Vec, CommandCenter: Navigation) {
  if (!CommandCenter.receviers?.length) return alert("Create at least one recevier");

  if (CommandCenter.aircraft) {
    alert("You can create only one aircraft");
    return;
  }
  CommandCenter.createAircraft(vector);
  BuildingsGraph.addTrace({
    x: [vector.coords[0]],
    y: [vector.coords[1]],
    z: [vector.coords[2]],
    type: "scatter3d",
    mode: "markers",
    name: "Aircraft",
    marker: { size: 15, color: "#FF0000" },
  });

  [aircraftX.value, aircraftY.value, aircraftZ.value] = ["", "", ""];
}

Init();
