import { TIMES_TO_MLS } from "../constants/time";
import { Receiver } from "./Receiver";
import { Aircraft } from "./Aircraft";
import { CoordsCalc } from "./utils/CoordsCalc";
import { Vec } from "./utils/Vector";
import { TMeasurement, TTDOAMeasurement } from "../types/navigation";

export class Navigation {
  private _receivers: Receiver[] = [];
  private _aircraft: Aircraft | null = null;
  private pathHistory: Vec[] = [];

  constructor() {}

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
    if (!this._aircraft || !this._receivers) throw new Error("No receivers or aircraft on the field");
    //? Model limitations. We do not simulate the flight of light and get just delay
    const delays = this._receivers.map(bcn => this._aircraft?.getLightDelay(new Vec(...bcn.pos)) || 0);
    const dateNow = performance.now() / 100;
    delays.forEach((del, i) => {
      //? Just as if the package from the receivers was sent to the aircraft, and all the clocks on the receivers are synchronized
      //? ms/1000 = s
      this._receivers?.[i].acceptSignal(dateNow / 1000 + del);
    });
  }

  // Generate Array<TDOA> from Array<TOA>
  getTDOA<T extends TMeasurement[]>(measurements: T): TTDOAMeasurement[] {
    const result: TTDOAMeasurement[] = [];
    for (let i = 0; i < measurements.length; i++) {
      for (let j = i + 1; j < measurements.length; j++) {
        const noise = (Math.random() - 0.5) / 10000000;
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
    if (this.pathHistory.length === 0) firstResult = coords.filterResult(coords.getClosedSolution(this._receivers));

    let approx = this.pathHistory[this.pathHistory.length - 1] || firstResult;
    let MLSResult: Vec = new Vec();

    for (let i = 0; i < TIMES_TO_MLS; i++) {
      // Get iterative solution by TDOA measurements
      MLSResult = coords.getIterativeSolutionByMLS(
        this.getTDOA(this._receivers.map(el => ({ TOA: el.signals[0], receiver: el.pos }))),
        approx.cut(3)
      );
      approx = MLSResult;
    }

    this._receivers.forEach(b => b.clear());

    this.pathHistory.push(MLSResult);
    return MLSResult;
  }

  clear() {
    this._aircraft?.clearGraph();
    this._aircraft = null;
    this._receivers = [];
  }

  get aircraft() {
    return this._aircraft;
  }
  get receivers() {
    return this._receivers;
  }
}
