import { TIME_TO_DETECT } from "../constants/time";
import type { Navigation } from "../models/Navigation";
import { Vec } from "../models/utils/Vector";
import { Visualize } from "../models/utils/Visualize";
import { get2DGraphSettings, getGraphSettings } from "./getSettings";
import { getNow } from "./time";

declare global {
  interface Window {
    isDetected: boolean;
  }
}

const ClosedEl = document.getElementById("closed") as HTMLElement;
const IterationEl = document.getElementById("MLS") as HTMLElement;
const ShipClosedEl = document.getElementById("ship-closed") as HTMLElement;
const ShipMLSEl = document.getElementById("ship-MLS") as HTMLElement;

const MainGraph = await new Visualize(ClosedEl, { title: "Closed solution" }).init();
const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();
const ShipClosedGraph = await new Visualize(ShipClosedEl, { title: "|ship - closed|" }).init();
const ShipMLSGraph = await new Visualize(ShipMLSEl, { title: "|ship - MLS|" }).init();

export async function startDetection(CommandCenter: Navigation) {
  if (window.isDetected) return;
  window.isDetected = true;
  CommandCenter.ship?.start();
  await CommandCenter.initCheck();

  const [closed, MLS] = CommandCenter.findCoords();

  MainGraph.addTrace(getGraphSettings(closed));
  IterationGraph.addTrace(getGraphSettings(MLS));

  const posDiffVec = new Vec(0, 0);
  ShipClosedGraph.addTrace(get2DGraphSettings(posDiffVec));
  ShipMLSGraph.addTrace(get2DGraphSettings(posDiffVec));

  CommandCenter.ship?.move();

  detection(0, CommandCenter);
}

async function detection(_time: number, CommandCenter: Navigation) {
  CommandCenter.ship?.move();

  await CommandCenter.initCheck();
  const [closed, MLS] = CommandCenter.findCoords();
  if (closed) {
    MainGraph.extendsTraceByVec(closed);
    IterationGraph.extendsTraceByVec(MLS);

    ShipClosedGraph.extendsTraceByVec(new Vec(getNow(), CommandCenter.ship?.getPositionDiff(closed) || 0), true);
    ShipMLSGraph.extendsTraceByVec(new Vec(getNow(), CommandCenter.ship?.getPositionDiff(MLS) || 0), true);
  } else {
    console.warn("There is no solution ", closed, MLS);
  }

  //? synthetic constraint
  setTimeout(() => window.isDetected && requestAnimationFrame(t => detection(t, CommandCenter)), TIME_TO_DETECT);
}

export function stopDetection(CommandCenter: Navigation) {
  CommandCenter.ship?.stop();
  window.isDetected = false;
}

export function clearDetectionGraphs() {
  MainGraph.clear(0);
  IterationGraph.clear(0);
}
