import { Matrix } from "./Matrix";
import { Vec } from "./Vector";

export function getXMtx(dt: number) {}

export class KalmanFilter {
	private _positions: Vec[] = [];
	constructor(private _State: Vec | Matrix, private _Covariance: Matrix) {}

	private calcState(X: Matrix) {
		const { Covariance } = this;
		// const K = Covariance.mtxMul(X.transpose()).mtxMul(X.mtxMul(Covariance.mtxMul(X.transpose())));
	}

	get Covariance() {
		return this._Covariance;
	}
	get State() {
		return this._State;
	}
}
