import type { Vec } from "./utils/Vector";

export class Beacon {
  private _signals: number[] | null = null;

  constructor(private _pos: Vec) {}

  get pos(): Vec {
    return this._pos;
  }

  /** @description accept signal form the ship (navigation post) you have to divide difference by TIMEOUT_FACTOR before using */
  acceptSignal() {
    if (!this._signals) this._signals = [];
    this._signals.push(Date.now());
  }

  clear() {
    this._signals = null;
  }
  get signals() {
    return this._signals;
  }
}
