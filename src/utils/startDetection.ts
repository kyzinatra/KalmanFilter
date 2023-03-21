import type { Navigation } from "../models/Navigation";
import { Visualize } from "../models/utils/Visualize";

declare global {
  interface Window {
    isDetected: boolean;
  }
}

export async function startDetection(CommandCenter: Navigation, MainGraph: Visualize, BuildingsGraph: Visualize) {
  if (window.isDetected) return;
  window.isDetected = true;
  CommandCenter.ship?.start();
  await CommandCenter.initCheck();
  const result = CommandCenter.findCord();
  MainGraph.addTrace({
    x: [result?.cords[0] || 0],
    y: [result?.cords[1] || 0],
    z: [result?.cords[2] || 0],
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
  CommandCenter.ship?.move();
  detection(0, MainGraph, CommandCenter, BuildingsGraph);
}

async function detection(_time: number, graph: Visualize, CommandCenter: Navigation, BuildingsGraph: Visualize) {
  console.log("detected");
  await CommandCenter.initCheck();
  const result = CommandCenter.findCord();
  if (result) {
    graph.extendTrace(
      {
        x: [[result.cords[0]]],
        y: [[result.cords[1]]],
        z: [[result.cords[2]]],
      },
      0
    );
  }
  CommandCenter.ship?.move();
  BuildingsGraph.moveTrace(
    {
      x: [CommandCenter.ship?._REAL_POS.cords[0] || 0],
      y: [CommandCenter.ship?._REAL_POS.cords[1] || 0],
      z: [CommandCenter.ship?._REAL_POS.cords[2] || 0],
      type: "scatter3d",
      mode: "markers",
      name: "Ship",
      marker: { size: 15, color: "#FF0000" },
    },
    1
  );
  setTimeout(
    () => window.isDetected && requestAnimationFrame(t => detection(t, graph, CommandCenter, BuildingsGraph)),
    1000
  );
}

export function stopDetection(CommandCenter: Navigation) {
  console.log("stop");
  CommandCenter.ship?.stop();
  window.isDetected = false;
}
