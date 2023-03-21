import { Vec } from "./Vector";

/** @description n*m (m rows and n columns) */
export class Matrix {
  private _mtx: number[][] = [];
  constructor(private readonly n: number, private readonly m: number) {
    if (n <= 0 || m <= 0) throw new RangeError("Matrix size must be positive");
    this._mtx = Array.from({ length: n }, () => Array.from({ length: m }, () => 0));
  }

  fill(callback: (n: number, m: number, prevValue: number) => number) {
    for (let n = 0; n < this._mtx.length; n++) {
      for (let m = 0; m < this._mtx[n].length; m++) {
        this._mtx[n][m] = callback(n, m, this._mtx[n][m]);
      }
    }
  }

  mul(scalar: number) {
    this.fill((_i, _j, val) => val * scalar);
    return this;
  }
  vecMul(vec: Vec) {
    const res = new Vec();
    for (let n = 0; n < this._mtx.length; n++) {
      for (let m = 0; m < Math.min(this._mtx[n].length, vec.length); m++) {
        res.addToCord(n, this._mtx[n][m] * vec.cords[m]);
      }
    }
    return res;
  }

  mtxMul(mulMxt: Matrix) {
    if (this.columnLength !== mulMxt.rowsLength)
      throw new Error(
        "The number of columns in the first matrix must be equal to the number of rows in the second matrix"
      );

    const result = new Matrix(this.rowsLength, mulMxt.columnLength);
    result.fill((i, j) => {
      let cellValue = 0;
      for (let r = 0; r < this.columnLength; r++) {
        cellValue += this._mtx[i][r] * mulMxt.get(r, j);
      }
      return cellValue;
    });
    return result;
  }

  extendWithIdentity() {
    const result = new Matrix(this.rowsLength, this.columnLength * 2);
    result.fill((i, j) => {
      if (this._mtx[i] && this._mtx[i][j]) return this._mtx[i][j];
      if (i === j - this.columnLength) return 1;
      return 0;
    });
    return result;
  }

  /** @description Matrix inverse O(n^3) */
  inv() {
    if (this.n !== this.m || this.det === 0)
      throw new Error("For non-square matrices and degenerate matrices there are no inverse matrices");

    const Mtx = this.extendWithIdentity().toRightTriangular();
    const inverse = new Matrix(this.rowsLength, this.columnLength);

    for (let i = this.rowsLength - 1; i >= 0; i--) {
      const divisor = Mtx.get(i, i);
      for (let p = 0; p < Mtx.columnLength; p++) {
        const new_element = Mtx.get(i, p) / divisor;
        Mtx.set(i, p, new_element);
        if (p >= this.rowsLength) inverse.set(i, p - this.columnLength, new_element);
      }
      for (let j = i - 1; j >= 0; j--) {
        const els = [];
        for (let p = 0; p < Mtx.columnLength; p++) {
          els.push(Mtx.get(j, p) - Mtx.get(i, p) * Mtx.get(j, i));
        }
        els.forEach((el, t) => Mtx.set(j, t, el));
      }
    }
    return inverse;
  }

  print(debug?: boolean) {
    if (debug === true) {
      console.log("{" + this._mtx.map(r => `{${r.join(",")}}`).join(",") + "}");
    }
    console.table(this._mtx);
  }

  get(i: number, j: number) {
    return this._mtx[i][j];
  }

  set(i: number, j: number, val: number) {
    this._mtx[i][j] = val;
  }

  copy() {
    const newMtx = new Matrix(this.rowsLength, this.columnLength);
    newMtx.fill((i, j) => this.get(i, j));
    return newMtx;
  }

  toRightTriangular(): Matrix {
    const result = this.copy();
    for (let i = 0; i < result.rowsLength; i++) {
      if (result.get(i, i) === 0) {
        for (let j = i + 1; j < result.rowsLength; j++) {
          if (result.get(j, i) !== 0) {
            for (let p = 0; p < result.columnLength; p++) {
              result.set(i, p, result.get(i, p) + result.get(j, p));
            }
            break;
          }
        }
      } else {
        for (let j = i + 1; j < result.rowsLength; j++) {
          let multiplier = result.get(j, i) / result.get(i, i);
          for (let p = 0; p < result.columnLength; p++) {
            result.set(j, p, p <= i ? 0 : result.get(j, p) - result.get(i, p) * multiplier);
          }
        }
      }
    }
    return result;
  }

  getMinor(i: number, j: number) {
    const res = new Matrix(this.rowsLength - 1, this.columnLength - 1);
    let resI = 0;
    let resJ = 0;
    for (let k = 0; k < this.rowsLength; k++) {
      if (k === i) continue;
      for (let m = 0; m < this.columnLength; m++) {
        if (m === j) continue;
        res.set(resI, resJ, this.get(k, m));
        resJ++;
      }
      resI++;
      resJ = 0;
    }
    return res;
  }

  transpose() {
    const result = new Matrix(this.columnLength, this.rowsLength);
    result.fill((i, j) => this._mtx[j][i]);
    return result;
  }

  get rowsLength() {
    return this.n;
  }
  get columnLength() {
    return this.m;
  }
  /** @description Matrix determinant O(n^3) */
  get det(): number {
    const RTMtx = this.toRightTriangular();
    let det = RTMtx.get(0, 0);
    for (let i = 1; i < RTMtx.rowsLength; i++) {
      det *= RTMtx.get(i, i);
    }
    return det;
  }
}
