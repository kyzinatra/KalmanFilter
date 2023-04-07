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

const IterationEl = document.getElementById("MLS") as HTMLElement;
const AircraftMLSEl = document.getElementById("aircraft-MLS") as HTMLElement;

const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();
const AircraftMLSGraph = await new Visualize(AircraftMLSEl, { title: "|aircraft - MLS|" }).init();

export async function startDetection(CommandCenter: Navigation) {
  if (window.isDetected) return;
  window.isDetected = true;
  CommandCenter.aircraft?.start();
  await CommandCenter.initCheck();

  const MLS = CommandCenter.findCoords();

  IterationGraph.addTrace(getGraphSettings(MLS));

  const posDiffVec = new Vec(0, 0);
  AircraftMLSGraph.addTrace(get2DGraphSettings(posDiffVec));

  CommandCenter.aircraft?.move();

  detection(0, CommandCenter);
}

async function detection(_time: number, CommandCenter: Navigation) {
  CommandCenter.aircraft?.move();

  await CommandCenter.initCheck();
  const MLS = CommandCenter.findCoords();

  IterationGraph.extendsTraceByVec(MLS);
  AircraftMLSGraph.extendsTraceByVec(new Vec(getNow(), CommandCenter.aircraft?.getPositionDiff(MLS) || 0), true);

  //? synthetic constraint
  setTimeout(() => window.isDetected && requestAnimationFrame(t => detection(t, CommandCenter)), TIME_TO_DETECT);
}

export function stopDetection(CommandCenter: Navigation) {
  CommandCenter.aircraft?.stop();
  window.isDetected = false;
}

export function clearDetectionGraphs() {
  IterationGraph.clear(0);
}
