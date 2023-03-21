import { Beacon } from "./Beacon";
import { Ship } from "./Ship";
import { CordsCalc } from "./utils/CordsCalc";
import { Vec } from "./utils/Vector";

export class Navigation {
  private _beacons: Beacon[] = [];
  private _ship: Ship | null = null;

  constructor() {}

  createBeacon(pos: Vec) {
    if (!this._beacons) this._beacons = [];
    this._beacons.push(new Beacon(pos));
    return this._beacons[this._beacons.length - 1];
  }

  createShip(pos: Vec) {
    this._ship = new Ship(pos, new Vec(0, 0, 0));
    return this._ship;
  }

  async initCheck() {
    if (!this._ship || !this._beacons) throw new Error("No beacons or ship on the field");
    //? Model limitations. We do not simulate the flight of light and get just delay
    const delays = this._beacons.map(bcn => this._ship?.getLightDelay(new Vec(...bcn.pos)) || 0);
    const dateNow = performance.now() / 10;
    delays.forEach((del, i) => {
      //? Just as if the time on the beacon was sent on the ship, and all the clocks on the beacons are synchronized
      this._beacons?.[i].acceptSignal(dateNow / 1000 + del);
    });
  }

  findCord() {
    // TODO Найти координаты решив уравнения
    if (!this._beacons) throw new Error("No beacons created");

    const cords = new CordsCalc();
    const result = cords.filterResult(cords.getClosedSolution(this._beacons));
    this._beacons.forEach(b => b.clear());
    if (!result) return;
    return result;
  }

  get ship() {
    return this._ship;
  }
  get beacons() {
    return this._beacons;
  }
}
