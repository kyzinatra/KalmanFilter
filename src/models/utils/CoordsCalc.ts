import { E, LIGHT_SPEED } from "../../constants/physic";
import { TTDOAMeasurement } from "../../types/navigation";
import { Receiver } from "../Receiver";
import { Matrix } from "./Matrix";
import { Vec } from "./Vector";

function TtoR(t: number) {
	return t * LIGHT_SPEED;
}

export class CoordsCalc {
	constructor() {}

	getClosedSolution(mes: Receiver[]) {
		if (mes.length !== 4) {
			if (mes.length < 4) {
				alert("You must create at least five receivers");
				return [];
			}

			const results: Vec[][] = [];
			for (let i = 0; i < Math.ceil(mes.length / 4); i++) {
				if (i == ~~(mes.length / 4) && mes.length % 4 != 0) {
					results.push(...this.getClosedSolution(mes.slice(mes.length - 4, mes.length)));
					break;
				}
				results.push(...this.getClosedSolution(mes.slice(i * 4, (i + 1) * 4)));
			}

			return results;
		}

		// calculations

		const A = new Matrix(4, 4);
		A.fill((i, j) => {
			if (j <= 2) {
				return mes[i].pos[j];
			}
			return -TtoR(mes[i].signals?.[0] || 0);
		});

		const s_i: Vec[] = mes.map((bcn) => new Vec(...[...bcn.pos, TtoR(bcn.signals[0])]));
		const b = new Vec(...s_i.map((s) => s.lorentzianProduct(s)));
		const invA = A.inv();
		const d = invA.vecMul(new Vec(1, 1, 1, 1)).mul(0.5);
		const e = invA.vecMul(b).mul(0.5);
		const alpha = d.lorentzianProduct(d);
		const betta = 2 * d.lorentzianProduct(e) - 1;
		const gamma = e.lorentzianProduct(e);

		const lambda1 = (-betta + Math.sqrt(betta ** 2 - 4 * alpha * gamma)) / (2 * alpha);
		const lambda2 = (-betta - Math.sqrt(betta ** 2 - 4 * alpha * gamma)) / (2 * alpha);

		return [[d.mul(lambda1).add(e), d.mul(lambda2).add(e)]];
	}

	getIterativeSolutionByMLS(measurements: TTDOAMeasurement[], approx: Vec) {
		const A = new Matrix(measurements.length, 3);

		const coords = approx.coords;
		const rCalc = (x: number, y: number, z: number) =>
			Math.sqrt((x - coords[0]) ** 2 + (y - coords[1]) ** 2 + (z - coords[2]) ** 2);

		A.fill((i, j) => {
			const receivers = measurements[i].receivers;
			const r_i = rCalc(receivers[0][0], receivers[0][1], receivers[0][2]);
			const r_j = rCalc(receivers[1][0], receivers[1][1], receivers[1][2]);
			return (receivers[1][j] - coords[j]) / r_j - (receivers[0][j] - coords[j]) / r_i;
		});

		function dmCalc(receiversPos: number[][]) {
			return (
				rCalc(receiversPos[0][0], receiversPos[0][1], receiversPos[0][2]) -
				rCalc(receiversPos[1][0], receiversPos[1][1], receiversPos[1][2])
			);
		}
		// ? subtract the real measurements by the measurements derived from the approximate solution m(x_a)
		const dm = new Vec(
			...Array.from(
				{ length: measurements.length },
				(_el, i) => TtoR(measurements[i].TDOA) - dmCalc(measurements[i].receivers)
			)
		);

		const A_T = A.transpose();
		const BVec = A_T.vecMul(dm); // b
		const MatrixDecomposition = A_T.mtxMul(A).choleskyDecomposition(); // L^TL = A
		const solutionY = MatrixDecomposition.solveTriangularSystem(BVec); // y = L^-1b
		const solution = MatrixDecomposition.transpose().solveTriangularSystem(solutionY); // x = (L^T)^-1y

		const AdjustmentSolution = approx.add(solution);

		return AdjustmentSolution;
	}

	filterResult(from: Vec[][]): Vec {
		const pattern = from[0];
		const el = pattern.find((vec) =>
			from.every((vecArr) => vecArr.some((vec2) => vec.sub(vec2).mod <= E))
		);
		if (el) return el;
		else return pattern[0];
	}
}
