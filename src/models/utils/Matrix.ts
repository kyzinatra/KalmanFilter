import { Vec } from "./Vector";

type TBorders = [
	[number, (i: number) => boolean, (i: number) => number],
	[number, (i: number, j: number) => boolean, (i: number) => number]
];

/** @description n*m (n rows and m columns) */
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
				res.addToCoord(n, this._mtx[n][m] * vec.coords[m]);
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
		if (this.rowsLength !== this.columnLength)
			throw new Error("For non-square matrices matrices there are no inverse matrices");

		const Mtx = this.extendWithIdentity().toUpperTriangular();
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
			console.log("{" + this._mtx.map((r) => `{${r.join(",")}}`).join(",") + "}");
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

	toUpperTriangular(): Matrix {
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

	//  inverse symmetric matrix
	choleskyDecomposition() {
		const res = new Matrix(this.rowsLength, this.columnLength);
		res.fill((j, i) => {
			if (j < i) return 0;
			if (i === 0 && j === 0) {
				return Math.sqrt(this.get(0, 0));
			}

			if (i === 0) {
				return this.get(j, i) / res.get(0, 0);
			}

			if (i === j) {
				let sum = 0;

				for (let p = 0; p < i; p++) {
					sum += res.get(i, p) ** 2;
				}
				return Math.sqrt(this.get(i, i) - sum);
			}

			let sum = 0;
			for (let p = 0; p < i; p++) {
				sum += res.get(i, p) * res.get(j, p);
			}
			return (1 / res.get(i, i)) * (this.get(j, i) - sum);
		});
		return res;
	}

	get rowsLength() {
		return this.n;
	}
	get columnLength() {
		return this.m;
	}
	/** @description Matrix determinant O(n^3) */
	get det(): number {
		const RTMtx = this.toUpperTriangular();
		let det = RTMtx.get(0, 0);
		for (let i = 1; i < RTMtx.rowsLength; i++) {
			det *= RTMtx.get(i, i);
		}
		return det;
	}

	solveTriangularSystem(b: Vec) {
		if (b.coords.length !== this.rowsLength)
			throw new Error("b vector must be the same size as the matrix");

		// Define cycle borders. Depends on matrix type (Lower triangular or Upper triangular)
		let borders: TBorders = [
			[0, (i: number) => i < this.rowsLength, (i: number) => ++i],
			[0, (i: number, j: number) => j <= i, (i: number) => ++i],
		];
		if (this.get(this.columnLength - 1, 0) === 0) {
			borders = [
				[this.rowsLength - 1, (i: number) => i >= 0, (i: number) => --i],
				[this.columnLength - 1, (_: number, j: number) => j >= 0, (i: number) => --i],
			];
		}

		const x = new Vec();
		for (let i = borders[0][0]; borders[0][1](i); i = borders[0][2](i)) {
			const xCoords = x.coords;
			let solution = b.coords[i];
			for (let j = borders[1][0]; borders[1][1](i, j); j = borders[1][2](j)) {
				if (xCoords[j] !== undefined) {
					solution -= xCoords[j] * this.get(i, j);
					continue;
				}
				if (this.get(i, j) === 0) {
					x.set(j, 0);
					continue;
				}

				x.set(j, solution / this.get(i, j));
				break;
			}
		}
		return x;
	}
}
