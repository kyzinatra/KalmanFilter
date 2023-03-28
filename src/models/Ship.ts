import { LIGHT_SPEED } from "../constants/physic";
import { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";
import { Visualize } from "./utils/Visualize";

export class Ship {
  id: string;
  dt: number = 0;
  private shipGraph: Visualize | null = null;

  constructor(private pos: Vec, private velocity: Vec = new Vec(100, 100, 100)) {
    this.id = uuid();
    new Visualize(document.getElementById("ship") as HTMLElement, { title: "Real Position" }).init().then(res => {
      this.shipGraph = res;
      res.addTrace({
        x: [pos.cords[0]],
        y: [pos.cords[1]],
        z: [pos.cords[2]],
        mode: "lines+markers",
        marker: {
          color: "rgb(242, 0, 52)",
          size: 5,
          symbol: "circle",
          line: {
            color: "rgb(242, 0, 52)",
            width: 2,
          },
          opacity: 0.8,
        },
        type: "scatter3d",
      });
    });
  }

  start() {
    this.dt = performance.now() / 1000;
  }
  move() {
    const now = performance.now() / 1000;
    this.pos = this.pos.add(this.velocity.mul(now - this.dt));
    this.velocity = this.velocity.add(
      new Vec(((Math.random() - 0.5) * 20) | 0, ((Math.random() - 0.5) * 20) | 0, (Math.random() * 20) | 0)
    );
    this.dt = now;
    this.drawGraph();
  }
  stop() {
    this.dt = 0;
  }

  private drawGraph() {
    this.shipGraph?.extendTrace(
      {
        x: [[this.pos.cords[0]]],
        y: [[this.pos.cords[1]]],
        z: [[this.pos.cords[2]]],
      },
      0
    );
  }

  clearGraph() {
    this.shipGraph?.clear(0);
  }

  /** @description get the time in seconds it takes light to reach the ship */
  getLightDelay(fromPos: Vec): number {
    return this.pos.sub(fromPos).mod / LIGHT_SPEED;
  }
}
