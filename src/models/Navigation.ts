import { TIMEOUT_FACTOR } from "../constants/physic";
import { Beacon } from "./Beacon";
import { Ship } from "./Ship";
import type { Vec } from "./utils/Vector";

export class Navigation {
  private beacons: Beacon[] | null = null;
  private ship: Ship | null = null;

  constructor() {}

  createBeacon(pos: Vec) {
    if (!this.beacons) this.beacons = [];
    this.beacons.push(new Beacon(pos));
  }

  createShip(pos: Vec) {
    this.ship = new Ship(pos);
  }

  initCheck() {
    if (!this.ship || !this.beacons) throw Error("No beacons or ship on the field");
    const delays = this.beacons.map(bcn => this.ship?.getLightDelay(bcn.pos) || 0);
    delays.forEach((del, i) => {
      setTimeout(() => this.beacons?.[i].acceptSignal(), del * TIMEOUT_FACTOR);
    });
  }

  findCord(checkNumber: number) {
    // TODO Найти координаты решив уравнения
  }
}
