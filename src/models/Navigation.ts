import { TIMES_TO_MLS } from "../constants/time";
import { Receiver } from "./Receiver";
import { Aircraft } from "./Aircraft";
import { CoordsCalc } from "./utils/CoordsCalc";
import { Vec } from "./utils/Vector";
import { TMeasurement, TTDOAMeasurement } from "../types/navigation";
import { KalmanFilter } from "./utils/Filter";
import {
	getFMatrix,
	getHMatrix,
	getPMatrix,
	getQMatrix,
	getRMatrix,
} from "../utils/kalmanMatrices";
import { Sigma } from "../constants/kalmanFilter";
import { Matrix } from "./utils/Matrix";

export class Navigation {
	private _receivers: Receiver[] = [];
	private _aircraft: Aircraft | null = null;
	private pathHistory: Vec[] = [];
	private KalmanFilter: KalmanFilter;

	private lastCheckTime: number = 0;
	private deltaTime: number = 0;
	private startTime: number = 0;

	constructor() {
		this.KalmanFilter = new KalmanFilter({
			F: getFMatrix(0, new Matrix(9, 9)),
			H: getHMatrix(),
			Q: getQMatrix(0, Sigma, new Matrix(9, 9)),
			R: getRMatrix(Sigma),
			P: getPMatrix(Sigma),
			x: new Vec(0, 0, 0, 0, 0, 0, 0, 0, 0),
		});
	}

	getLastFilterResult() {
		return this.KalmanFilter.state;
	}

	createReceiver(pos: Vec) {
		if (!this._receivers) this._receivers = [];
		this._receivers.push(new Receiver(pos));
		return this._receivers[this._receivers.length - 1];
	}

	createAircraft(pos: Vec) {
		this._aircraft = new Aircraft(pos);
		return this._aircraft;
	}

	async initCheck() {
		if (!this._aircraft || !this._receivers)
			throw new Error("No receivers or aircraft on the field");

		const dateNow = performance.now() / 1000;
		this.deltaTime = dateNow - this.startTime - this.lastCheckTime;
		this.lastCheckTime = dateNow - this.startTime;

		this.aircraft?.move(this.deltaTime);
		//? Model limitations. We do not simulate the flight of light and get just delay
		const delays = this._receivers.map(
			(bcn) => this._aircraft?.getLightDelay(new Vec(...bcn.pos)) || 0
		);

		delays.forEach((del, i) => {
			//? Just as if the package from the receivers was sent to the aircraft, and all the clocks on the receivers are synchronized
			//? ms/1000 = s
			this._receivers?.[i].acceptSignal(dateNow / 100 + del);
		});
	}

	// Generate Array<TDOA> from Array<TOA>
	getTDOA<T extends TMeasurement[]>(measurements: T): TTDOAMeasurement[] {
		const result: TTDOAMeasurement[] = [];
		for (let i = 0; i < measurements.length; i++) {
			for (let j = i + 1; j < measurements.length; j++) {
				// E(noise) == 0
				const noise = (Math.random() - 0.5) / 10_000_000;
				result.push({
					TDOA: measurements[i].TOA - measurements[j].TOA + noise,
					receivers: [measurements[i].receiver, measurements[j].receiver],
				});
			}
		}

		return result;
	}

	findCoords() {
		if (!this._receivers) throw new Error("No receivers created");

		const coords = new CoordsCalc();
		let firstResult;
		if (this.pathHistory.length === 0)
			firstResult = coords.filterResult(coords.getClosedSolution(this._receivers));

		let approx = this.pathHistory[this.pathHistory.length - 1] || firstResult;
		let MLSResult: Vec = new Vec();

		for (let i = 0; i < TIMES_TO_MLS; i++) {
			// Get iterative solution by TDOA measurements
			MLSResult = coords.getIterativeSolutionByMLS(
				this.getTDOA(this._receivers.map((el) => ({ TOA: el.signals[0], receiver: el.pos }))),
				approx.cut(3)
			);
			approx = MLSResult;
		}

		this._receivers.forEach((b) => b.clear());

		this.pushHistory(MLSResult);
		return MLSResult;
	}

	filter(z: Vec) {
		this.KalmanFilter.FMatrix = getFMatrix(this.deltaTime, this.KalmanFilter.FMatrix);
		this.KalmanFilter.QMatrix = getQMatrix(this.deltaTime, Sigma, this.KalmanFilter.QMatrix);

		const result = this.KalmanFilter.update(z);
		return result;
	}

	startAircraft() {
		this.startTime = performance.now() / 1000;
	}
	clear() {
		this._aircraft?.clearGraph();
		this._aircraft = null;
		this._receivers = [];
	}

	pushHistory(point: Vec) {
		const result = point.cut(3);
		this.pathHistory.push(result);
		this.filter(result);
	}
	get aircraft() {
		return this._aircraft;
	}
	get receivers() {
		return this._receivers;
	}
}
