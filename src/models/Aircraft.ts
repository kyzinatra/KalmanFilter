import { LIGHT_SPEED } from "../constants/physic";
import { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";
import { Visualize } from "./utils/Visualize";
import { getGraphSettings } from "../utils/getSettings";

export class Aircraft {
  id: string;
  dt: number = 0;
  private aircraftGraph: Visualize | null = null;

  constructor(private pos: Vec, private velocity: Vec = new Vec(10, 10, 10)) {
    this.id = uuid();
    new Visualize(document.getElementById("aircraft") as HTMLElement, { title: "Real Position" }).init().then(res => {
      this.aircraftGraph = res;
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
    this.aircraftGraph?.extendsTraceByVec(this.pos);
  }

  clearGraph() {
    this.aircraftGraph?.clear(0);
  }

  /** @description get the time in seconds it takes light to reach the aircraft */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }

  getPositionDiff(fromPos: Vec): number {
    return this.pos.sub(new Vec(...fromPos.coords.slice(0, 3))).mod;
  }
}
