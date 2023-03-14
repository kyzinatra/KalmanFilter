import { Beacon } from "./Beacon";
import { Ship } from "./Ship";
import { Vec } from "./utils/Vector";

export class Navigation {
  private _beacons: Beacon[] | null = null;
  private _ship: Ship | null = null;

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
    if (!this._ship || !this._beacons) throw Error("No beacons or ship on the field");
    //? Model limitations. We do not simulate the flight of light and get just delay
    const delays = this._beacons.map(bcn => this._ship?.getLightDelay(bcn.pos) || 0);
    const dateNow = performance.now();
    delays.forEach((del, i) => {
      //? Just as if the time on the beacon was sent on the ship, and all the clocks on the beacons are synchronized
      this._beacons?.[i].acceptSignal(dateNow + del);
    });
  }

  findCord() {
    // TODO Найти координаты решив уравнения
    if (!this._beacons) throw new Error("No beacons created");

    const delays = this._beacons?.map(a => a.signals?.[0]);

    return new Vec(1 + Math.random(), 2 + Math.random(), 3 + Math.random());
  }

  get ship() {
    return this._ship;
  }
}
