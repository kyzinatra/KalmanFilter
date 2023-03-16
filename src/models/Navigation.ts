import { LIGHT_SPEED } from "../constants/physic";
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
    const delays = this._beacons.map(bcn => this._ship?.getLightDelay(new Vec(...bcn.pos)) || 0);
    const dateNow = performance.now();
    delays.forEach((del, i) => {
      //? Just as if the time on the beacon was sent on the ship, and all the clocks on the beacons are synchronized
      this._beacons?.[i].acceptSignal(dateNow + del);
    });
  }

  findCord() {
    // TODO Найти координаты решив уравнения
    if (!this._beacons) throw new Error("No beacons created");

    const mtxSystem: string[][] = [];

    for (let i = 0; i < this._beacons.length; i++) {
      for (let j = i + 1; j < this._beacons.length; j++) {
        const [x_i, y_i, z_i] = this._beacons[i].pos;
        const [x_j, y_j, z_j] = this._beacons[j].pos;
        const signalToTower_i = this._beacons?.[i].signals?.[0] || 0;
        const signalToTower_j = this._beacons?.[j].signals?.[0] || 0;
        const dist_i = signalToTower_i * LIGHT_SPEED - signalToTower_j * LIGHT_SPEED;

        mtxSystem.push([
          `Math.sqrt((x - ${x_i})**2 + (y - ${y_i})**2 + (z - ${z_i})**2) - Math.sqrt((x - ${x_j})**2 + (y - ${y_j})**2 + (z - ${z_j})**2)`,
          `${dist_i}`,
        ]);
      }
    }
    console.log(mtxSystem);
    this._beacons.forEach(b => b.clear());

    return new Vec(1 + Math.random(), 2 + Math.random(), 3 + Math.random());
  }

  get ship() {
    return this._ship;
  }
  get beacons() {
    return this._beacons;
  }
}
