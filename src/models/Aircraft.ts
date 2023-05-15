import { LIGHT_SPEED } from "../constants/physic";
import { Vec } from "./utils/Vector";
import { v4 as uuid } from "uuid";
import { Visualize } from "./utils/Visualize";
import { getGraphSettings } from "../utils/getSettings";

export class Aircraft {
	id: string;
	private aircraftGraph: Visualize | null = null;

	constructor(private pos: Vec, private velocity: Vec = new Vec(10, 10, 0)) {
		this.id = uuid();
		new Visualize(document.getElementById("aircraft") as HTMLElement, { title: "Real Position" })
			.init()
			.then((res) => {
				this.aircraftGraph = res;
				res.addTrace(getGraphSettings(pos, "242 0 52"));
			});
	}

	moveByDt(dt: number) {
		this.pos = this.pos.add(this.velocity.mul(dt));
		this.velocity = this.velocity.add(new Vec(0.5, 0.1, 1).mul(dt));
		this.drawGraph();
	}

	private drawGraph() {
		this.aircraftGraph?.extendsTraceByVec(this.pos);
	}

	/** @description get the time in seconds it takes light to reach the aircraft */
	getLightDelay(fromPos: Vec): number {
		return this.pos.sub(fromPos).mod / LIGHT_SPEED;
	}

	getPositionMod(fromPos: Vec): number {
		return this.pos.sub(new Vec(...fromPos.coords.slice(0, 3))).mod;
	}
}
