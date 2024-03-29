import { Navigation } from "./models/Navigation";
import { Vec } from "./models/utils/Vector";
import { Visualize } from "./models/utils/Visualize";
import { detection, initDetection } from "./utils/detection";

const BuildingsGraphEl = document.querySelector("#BuildingsGraph") as HTMLElement;

const receiversForm = document.getElementById("create-receivers-form") as HTMLFormElement;
const aircraftForm = document.getElementById("create-aircraft-form") as HTMLFormElement;
const signalStartBtn = document.getElementById("signal-start") as HTMLButtonElement;
const signalStopBtn = document.getElementById("signal-stop") as HTMLButtonElement;

const [receiversX, receiversY, receiversZ] = receiversForm.elements as any as HTMLInputElement[];
const [aircraftX, aircraftY, aircraftZ] = aircraftForm.elements as any as HTMLInputElement[];

const BuildingsGraph = await new Visualize(BuildingsGraphEl).init();

export async function Init() {
	const isStop = { isStop: true };
	const CommandCenter = new Navigation();

	receiversForm.addEventListener("submit", (e) => {
		e.preventDefault();
		receiversHandler(
			new Vec(+receiversX.value, +receiversY.value, +receiversZ.value),
			CommandCenter
		);
	});
	initDetection(CommandCenter);

	aircraftForm.addEventListener("submit", (e) => {
		e.preventDefault();
		aircraftHandler(new Vec(+aircraftX.value, +aircraftY.value, +aircraftZ.value), CommandCenter);
	});

	signalStartBtn.addEventListener("click", () => {
		if (isStop.isStop === false) return;
		isStop.isStop = false;
		CommandCenter.startAircraft();
		detection(isStop, CommandCenter);
	});

	signalStopBtn.addEventListener("click", () => {
		isStop.isStop = true;
	});

	// TODO: Delete for manually control from UI
	for (let i = 0; i < 12; i++) {
		receiversHandler(
			new Vec(
				(Math.random() * 100_000) | 0,
				(Math.random() * 100_000) | 0,
				(Math.random() * 100_000) | 0
			),
			CommandCenter
		);
	}

	const aircraftVec = new Vec(Math.random(), Math.random(), Math.random());
	aircraftHandler(aircraftVec, CommandCenter);
}

function receiversHandler(vector: Vec, CommandCenter: Navigation) {
	[receiversX.value, receiversY.value, receiversZ.value] = ["", "", ""];
	if (!CommandCenter.receivers?.length) {
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
	if (!CommandCenter.receivers?.length) return alert("Create at least one receivers");

	if (CommandCenter.hasAircraft) {
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
