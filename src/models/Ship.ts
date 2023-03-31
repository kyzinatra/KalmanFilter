import { LIGHT_SPEED } from "../constants/physic";
import { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";
import { Visualize } from "./utils/Visualize";
import { getGraphSettings } from "../utils/getSettings";

export class Ship {
  id: string;
  dt: number = 0;
  private shipGraph: Visualize | null = null;

  constructor(private pos: Vec, private velocity: Vec = new Vec(10, 10, 10)) {
    this.id = uuid();
    new Visualize(document.getElementById("ship") as HTMLElement, { title: "Real Position" }).init().then(res => {
      this.shipGraph = res;
      res.addTrace(getGraphSettings(pos, "242 0 52", "242 0 52"));
    });
  }

  start() {
    this.dt = performance.now() / 1000;
  }
  move() {
    if (this.dt === 0) return;
    const now = performance.now() / 1000;
    const dt = now - this.dt;
    this.pos = this.pos.add(this.velocity.mul(dt));
    this.velocity = this.velocity.add(new Vec(0, 0, 1).mul(dt));
    this.dt = now;
    this.drawGraph();
  }
  stop() {
    this.dt = 0;
  }

  private drawGraph() {
    this.shipGraph?.extendsTraceByVec(this.pos);
  }

  clearGraph() {
    this.shipGraph?.clear(0);
  }

  /** @description get the time in seconds it takes light to reach the ship */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }

  getPositionDiff(fromPos: Vec): number {
    return this.pos.sub(new Vec(...fromPos.cords.slice(0, 3))).mod;
  }
}
