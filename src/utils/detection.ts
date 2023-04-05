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
const AircraftClosedEl = document.getElementById("aircraft-closed") as HTMLElement;
const AircraftMLSEl = document.getElementById("aircraft-MLS") as HTMLElement;

const MainGraph = await new Visualize(ClosedEl, { title: "Closed solution" }).init();
const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();
const AircraftClosedGraph = await new Visualize(AircraftClosedEl, { title: "|aircraft - closed|" }).init();
const AircraftMLSGraph = await new Visualize(AircraftMLSEl, { title: "|aircraft - MLS|" }).init();

export async function startDetection(CommandCenter: Navigation) {
  if (window.isDetected) return;
  window.isDetected = true;
  CommandCenter.aircraft?.start();
  await CommandCenter.initCheck();

  const [closed, MLS] = CommandCenter.findCoords();

  MainGraph.addTrace(getGraphSettings(closed));
  IterationGraph.addTrace(getGraphSettings(MLS));

  const posDiffVec = new Vec(0, 0);
  AircraftClosedGraph.addTrace(get2DGraphSettings(posDiffVec));
  AircraftMLSGraph.addTrace(get2DGraphSettings(posDiffVec));

  CommandCenter.aircraft?.move();

  detection(0, CommandCenter);
}

async function detection(_time: number, CommandCenter: Navigation) {
  CommandCenter.aircraft?.move();

  await CommandCenter.initCheck();
  const [closed, MLS] = CommandCenter.findCoords();
  if (closed) {
    MainGraph.extendsTraceByVec(closed);
    IterationGraph.extendsTraceByVec(MLS);

    AircraftClosedGraph.extendsTraceByVec(new Vec(getNow(), CommandCenter.aircraft?.getPositionDiff(closed) || 0), true);
    AircraftMLSGraph.extendsTraceByVec(new Vec(getNow(), CommandCenter.aircraft?.getPositionDiff(MLS) || 0), true);
  } else {
    console.warn("There is no solution ", closed, MLS);
  }

  //? synthetic constraint
  setTimeout(() => window.isDetected && requestAnimationFrame(t => detection(t, CommandCenter)), TIME_TO_DETECT);
}

export function stopDetection(CommandCenter: Navigation) {
  CommandCenter.aircraft?.stop();
  window.isDetected = false;
}

export function clearDetectionGraphs() {
  MainGraph.clear(0);
  IterationGraph.clear(0);
}
