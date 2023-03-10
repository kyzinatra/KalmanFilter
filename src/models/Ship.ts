import { LIGHT_SPEED } from "../constants/physic";
import type { Vec } from "./utils/Vector";

export class Ship {
  constructor(private pos: Vec) {}

  /** @description get the time in seconds it takes light to reach the ship */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }
}
