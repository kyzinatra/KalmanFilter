import { E, LIGHT_SPEED } from "../../constants/physic";
import { Receiver } from "../Receiver";
import { Matrix } from "./Matrix";
import { Vec } from "./Vector";

function TtoR(t: number) {
  return t * LIGHT_SPEED;
}

export class coordsCalc {
  constructor() {}

  getClosedSolution(mes: Receiver[]) {
    if (mes.length !== 4) {
      if (mes.length < 4) {
        alert("You must create at least five receviers");
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

    const A = new Matrix(4, 4);
    A.fill((i, j) => {
      if (j <= 2) {
        return mes[i].pos[j];
      }
      return -TtoR(mes[i].signals?.[0] || 0);
    });

    const s_i = mes.map(bcn => new Vec(...[...bcn.pos, TtoR(bcn.signals[0])]));
    const b = new Vec(...s_i.map(s => s.lorentzianProduct(s)));
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

  getIterativeSolutionByMLS(measurements: Receiver[], approx: Vec) {
    function dmCalc(approxPos: number[], recevierPos: number[]) {
      return (
        Math.sqrt(
          (recevierPos[0] - approxPos[0]) ** 2 +
            (recevierPos[1] - approxPos[1]) ** 2 +
            (recevierPos[2] - approxPos[2]) ** 2
        ) + approxPos[3]
      );
    }

    const A = new Matrix(measurements.length, 4);

    A.fill((i, j) => {
      const m_i = measurements[i].pos;
      const x_a = approx.coords;
      const d_i = Math.sqrt((m_i[0] - x_a[0]) ** 2 + (m_i[1] - x_a[1]) ** 2 + (m_i[2] - x_a[2]) ** 2);
      if (j === 3) return 1;
      return (x_a[j] - m_i[j]) / d_i;
    });

    //? subtract the real measurements by the measurements derived from the approximate solution m(x_a)
    const dm = new Vec(
      ...Array.from(
        { length: measurements.length },
        (_el, i) => TtoR(measurements[i].signals[0]) - dmCalc(approx.coords, measurements[i].pos)
      )
    );

    const A_T = A.transpose();
    const AdjustmentSolution = approx.add(A_T.mtxMul(A).inv().mtxMul(A_T).vecMul(dm));

    return AdjustmentSolution;
  }

  filterResult(from: Vec[][]): Vec {
    const pattern = from[0];
    const el = pattern.find(vec => from.every(vecArr => vecArr.some(vec2 => vec.sub(vec2).mod <= E)));
    if (el) return el;
    else return pattern[0];
  }
}
