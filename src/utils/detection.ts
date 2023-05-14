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

let i = 0;

const IterationEl = document.getElementById("MLS") as HTMLElement;
const AircraftMLSEl = document.getElementById("aircraft-MLS") as HTMLElement;
const KalmanEl = document.getElementById("Kalman") as HTMLElement;
const KalmanModEl = document.getElementById("aircraft-Kalman") as HTMLElement;

const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();
const AircraftMLSGraph = await new Visualize(AircraftMLSEl, { title: "|aircraft - MLS|" }).init();
const KalmanGraph = await new Visualize(KalmanEl, { title: "Kalman" }).init();
const KalmanModGraph = await new Visualize(KalmanModEl, { title: "|aircraft - Kalman|" }).init();

export async function startDetection(CommandCenter: Navigation) {
	if (window.isDetected) return;
	window.isDetected = true;
	CommandCenter.startAircraft();
	await CommandCenter.initCheck();

	const MLS = CommandCenter.findCoords();

	IterationGraph.addTrace(getGraphSettings(MLS));
	KalmanGraph.addTrace(getGraphSettings(CommandCenter.getLastFilterResult(), "0 0 255"));
	KalmanModGraph.addTrace(get2DGraphSettings(new Vec(0, 0)));
	AircraftMLSGraph.addTrace(get2DGraphSettings(new Vec(0, 0), "0 0 255"));

	setTimeout(
		() => window.isDetected && requestAnimationFrame((t) => detection(t, CommandCenter)),
		TIME_TO_DETECT
	);
}

// This
async function detection(_time: number, CommandCenter: Navigation) {
	i++;

	await CommandCenter.initCheck();
	const MLS = CommandCenter.findCoords();

	IterationGraph.extendsTraceByVec(MLS);
	AircraftMLSGraph.extendsTraceByVec(
		new Vec(getNow(), CommandCenter.aircraft?.getPositionDiff(MLS) || 0),
		true
	);
	const filterRes = CommandCenter.getLastFilterResult();
	KalmanGraph.extendsTraceByVec(filterRes);
	KalmanModGraph.extendsTraceByVec(
		new Vec(getNow(), CommandCenter.aircraft?.getPositionDiff(filterRes) || 0),
		true
	);

	if (i % 100 === 0) console.log(i);

	//? synthetic constraint
	if (i > 1700) return;
	setTimeout(
		() => window.isDetected && requestAnimationFrame((t) => detection(t, CommandCenter)),
		TIME_TO_DETECT
	);
}

export function stopDetection() {
	window.isDetected = false;
}

export function clearDetectionGraphs() {
	IterationGraph.clear(0);
}
