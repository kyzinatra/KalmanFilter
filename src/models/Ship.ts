import { LIGHT_SPEED } from "../constants/physic";
import { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";

export class Ship {
  id: string;
  dt: number = 0;
  constructor(private pos: Vec, private velocity: Vec) {
    this.id = uuid();
  }

  start() {
    this.dt = performance.now() / 1000;
  }
  move() {
    const now = performance.now() / 1000;
    this.pos = this.pos.add(this.velocity.mul(now - this.dt));
    this.velocity = this.velocity.add(
      new Vec(((Math.random() - 0.5) * 100) | 0, ((Math.random() - 0.5) * 50) | 0, ((Math.random() - 0.55) * 50) | 0)
    );
    this.dt = now;
  }
  stop() {
    this.dt = 0;
  }

  get _REAL_POS() {
    return this.pos;
  }

  /** @description get the time in seconds it takes light to reach the ship */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }
}
