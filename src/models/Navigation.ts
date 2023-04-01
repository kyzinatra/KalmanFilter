import { TIMES_TO_MLS } from "../constants/time";
import { Beacon } from "./Beacon";
import { Ship } from "./Ship";
import { coordsCalc } from "./utils/CoordsCalc";
import { Vec } from "./utils/Vector";

export class Navigation {
  private _beacons: Beacon[] = [];
  private _ship: Ship | null = null;
  private pathHistory: [Vec, Vec][] = [];

  constructor() {}

  createBeacon(pos: Vec) {
    if (!this._beacons) this._beacons = [];
    this._beacons.push(new Beacon(pos));
    return this._beacons[this._beacons.length - 1];
  }

  createShip(pos: Vec) {
    this._ship = new Ship(pos);
    return this._ship;
  }

  async initCheck() {
    if (!this._ship || !this._beacons) throw new Error("No beacons or ship on the field");
    //? Model limitations. We do not simulate the flight of light and get just delay
    const delays = this._beacons.map(bcn => this._ship?.getLightDelay(new Vec(...bcn.pos)) || 0);
    const dateNow = performance.now() / 100;
    delays.forEach((del, i) => {
      //? Just as if the package from the beacon was sent to the ship, and all the clocks on the beacons are synchronized
      //? ms/1000 = s
      this._beacons?.[i].acceptSignal(dateNow / 1000 + del);
    });
  }

  findCoords() {
    if (!this._beacons) throw new Error("No beacons created");

    const coords = new coordsCalc();

    const result = coords.filterResult(coords.getClosedSolution(this._beacons));

    let approx = this.pathHistory[this.pathHistory.length - 1]?.[1] || result;
    let MLSResult: Vec = new Vec();
    for (let i = 0; i < TIMES_TO_MLS; i++) {
      MLSResult = coords.getIterativeSolutionByMLS(this._beacons, approx);
      approx = MLSResult;
    }

    this._beacons.forEach(b => b.clear());
    if (!result) return [new Vec(), new Vec()];

    this.pathHistory.push([result, MLSResult]);
    return [result, MLSResult];
  }

  clear() {
    this._ship?.clearGraph();
    this._ship = null;
    this._beacons = [];
  }

  get ship() {
    return this._ship;
  }
  get beacons() {
    return this._beacons;
  }
}
