import { TIME_TO_DETECT } from "../constants/time";
import type { Navigation } from "../models/Navigation";
import { Vec } from "../models/utils/Vector";
import { Visualize } from "../models/utils/Visualize";
import { get2DGraphSettings, getGraphSettings } from "./getSettings";
import { getNow } from "./time";

const IterationEl = document.getElementById("MLS") as HTMLElement;
const AircraftMLSEl = document.getElementById("aircraft-MLS") as HTMLElement;
const KalmanEl = document.getElementById("Kalman") as HTMLElement;
const KalmanModEl = document.getElementById("aircraft-Kalman") as HTMLElement;

const IterationGraph = await new Visualize(IterationEl, { title: "MLS solution" }).init();
const AircraftMLSGraph = await new Visualize(AircraftMLSEl, { title: "|aircraft - MLS|" }).init();
const KalmanGraph = await new Visualize(KalmanEl, { title: "Kalman" }).init();
const KalmanModGraph = await new Visualize(KalmanModEl, { title: "|aircraft - Kalman|" }).init();

export async function initDetection(CommandCenter: Navigation) {
	IterationGraph.addTrace(getGraphSettings(new Vec(0, 0, 0)));
	AircraftMLSGraph.addTrace(get2DGraphSettings(new Vec(0, 0), "0 0 255"));

	KalmanGraph.addTrace(getGraphSettings(CommandCenter.getLastFilterResult(), "0 0 255"));
	KalmanModGraph.addTrace(get2DGraphSettings(new Vec(0, 0)));
}

export async function detection(stop: { isStop: boolean }, CommandCenter: Navigation) {
	if (stop.isStop === true) CommandCenter.stopAircraft();
	await CommandCenter.makeCheck();
	const MLS = CommandCenter.findCoords();

	IterationGraph.extendsTraceByVec(MLS);
	AircraftMLSGraph.extendsTraceByVec(
		new Vec(getNow(), CommandCenter?.getPositionMod(MLS) || 0),
		true
	);
	const filterRes = CommandCenter.getLastFilterResult();
	KalmanGraph.extendsTraceByVec(filterRes);
	KalmanModGraph.extendsTraceByVec(
		new Vec(getNow(), CommandCenter?.getPositionMod(filterRes) || 0),
		true
	);

	// //? synthetic constraint
	setTimeout(() => requestAnimationFrame(() => detection(stop, CommandCenter)), TIME_TO_DETECT);
}
