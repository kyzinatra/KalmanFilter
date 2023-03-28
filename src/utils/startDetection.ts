import type { Navigation } from "../models/Navigation";
import type { Vec } from "../models/utils/Vector";
import { Visualize } from "../models/utils/Visualize";

declare global {
  interface Window {
    isDetected: boolean;
  }
}
function getSettings(vec: Vec) {
  return {
    x: [vec.cords[0] || 0],
    y: [vec.cords[1] || 0],
    z: [vec.cords[2] || 0],
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
  } as any;
}

const ClosedEl = document.querySelector("#closed") as HTMLElement;
const IterationEl = document.querySelector("#MLS") as HTMLElement;

const MainGraph = await new Visualize(ClosedEl, { title: "Closed solution" }).init();
const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();

export async function startDetection(CommandCenter: Navigation) {
  if (window.isDetected) return;
  window.isDetected = true;
  CommandCenter.ship?.start();
  await CommandCenter.initCheck();

  const [closed, MLS] = CommandCenter.findCord();

  MainGraph.addTrace(getSettings(closed));
  IterationGraph.addTrace(getSettings(MLS));

  CommandCenter.ship?.move();

  detection(0, CommandCenter);
}

async function detection(_time: number, CommandCenter: Navigation) {
  console.log("detected");

  await CommandCenter.initCheck();
  const [closed, MLS] = CommandCenter.findCord();
  if (closed) {
    console.log(closed, MLS);
    MainGraph.extendsTraceByVec(closed);
    IterationGraph.extendsTraceByVec(MLS);
  } else {
    console.warn("There is no solution ", closed, MLS);
  }

  CommandCenter.ship?.move();

  setTimeout(() => window.isDetected && requestAnimationFrame(t => detection(t, CommandCenter)), 300);
}

export function stopDetection(CommandCenter: Navigation) {
  console.log("stop");
  CommandCenter.ship?.stop();
  window.isDetected = false;
}
