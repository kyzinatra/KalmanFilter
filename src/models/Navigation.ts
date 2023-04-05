import { TIMES_TO_MLS } from "../constants/time";
import { Receiver } from "./Receiver";
import { Aircraft } from "./Aircraft";
import { coordsCalc } from "./utils/CoordsCalc";
import { Vec } from "./utils/Vector";

export class Navigation {
  private _receviers: Receiver[] = [];
  private _aircraft: Aircraft | null = null;
  private pathHistory: [Vec, Vec][] = [];

  constructor() {}

  createReceiver(pos: Vec) {
    if (!this._receviers) this._receviers = [];
    this._receviers.push(new Receiver(pos));
    return this._receviers[this._receviers.length - 1];
  }

  createAircraft(pos: Vec) {
    this._aircraft = new Aircraft(pos);
    return this._aircraft;
  }

  async initCheck() {
    if (!this._aircraft || !this._receviers) throw new Error("No receviers or aircraft on the field");
    //? Model limitations. We do not simulate the flight of light and get just delay
    const delays = this._receviers.map(bcn => this._aircraft?.getLightDelay(new Vec(...bcn.pos)) || 0);
    const dateNow = performance.now() / 100;
    delays.forEach((del, i) => {
      //? Just as if the package from the recevier was sent to the aircraft, and all the clocks on the receviers are synchronized
      //? ms/1000 = s
      this._receviers?.[i].acceptSignal(dateNow / 1000 + del);
    });
  }

  findCoords() {
    if (!this._receviers) throw new Error("No receviers created");

    const coords = new coordsCalc();

    const result = coords.filterResult(coords.getClosedSolution(this._receviers));

    let approx = this.pathHistory[this.pathHistory.length - 1]?.[1] || result;
    let MLSResult: Vec = new Vec();
    for (let i = 0; i < TIMES_TO_MLS; i++) {
      MLSResult = coords.getIterativeSolutionByMLS(this._receviers, approx);
      approx = MLSResult;
    }

    this._receviers.forEach(b => b.clear());
    if (!result) return [new Vec(), new Vec()];

    this.pathHistory.push([result, MLSResult]);
    return [result, MLSResult];
  }

  clear() {
    this._aircraft?.clearGraph();
    this._aircraft = null;
    this._receviers = [];
  }

  get aircraft() {
    return this._aircraft;
  }
  get receviers() {
    return this._receviers;
  }
}
