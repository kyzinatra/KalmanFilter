import { Matrix } from "./Matrix";
import { Vec } from "./Vector";

export function getXMtx(_dt: number) {}

export class KalmanFilter {
	// private _positions: Vec[] = [];
	constructor(private _State: Vec | Matrix, private _Covariance: Matrix) {}

	// private calcState(X: Matrix) {}

	get Covariance() {
		return this._Covariance;
	}
	get State() {
		return this._State;
	}
}
