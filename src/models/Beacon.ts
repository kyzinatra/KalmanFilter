import type { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";

/**
 * @description Beacon class is used to simulate the beacon.
 * It has a position in 3D space and can accept signals from the ship.
 * It controlled by Navigation class, like the ship, like a beacon in real life.
 */
export class Beacon {
  private _signals: number[] = [];
  id: string;

  constructor(private _pos: Vec) {
    this.id = uuid();
  }

  get pos(): number[] {
    return this._pos.cords;
  }

  /** @description accept signal form the ship (navigation post) you have to divide difference by TIMEOUT_FACTOR before using */
  acceptSignal(comingTime: number) {
    if (!this._signals) this._signals = [];
    this._signals.push(comingTime);
  }

  clear() {
    this._signals = [];
  }
  get signals() {
    return this._signals;
  }
}
