import { LIGHT_SPEED } from "../constants/physic";
import type { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";

export class Ship {
  id: string;

  constructor(private pos: Vec) {
    this.id = uuid();
  }

  /** @description get the time in seconds it takes light to reach the ship */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }
}
