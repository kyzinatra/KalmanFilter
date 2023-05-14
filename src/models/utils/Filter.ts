import { Matrix } from "./Matrix";
import { Vec } from "./Vector";

interface TInputData {
	F: Matrix; // process evolution
	H: Matrix; // observation model
	Q: Matrix; // process noise covariance
	R: Matrix; // observation noise covariance
	P: Matrix; // estimation error covariance
	x: Vec;
}

export class KalmanFilter {
	private F: Matrix;
	private H: Matrix;
	private Q: Matrix;
	private R: Matrix;
	private P: Matrix;
	private x: Vec; // State estimate

	public _history: Vec[] = [];

	constructor(settings: TInputData) {
		this.F = settings.F;
		this.H = settings.H;
		this.Q = settings.Q;
		this.R = settings.R;
		this.P = settings.P;
		this.x = settings.x;
	}

	/**
	 * @description Predicts the state and covariance of the next step
	 * @see https://en.wikipedia.org/wiki/Kalman_filter#:~:text=29%5D%5B30%5D-,Predict,-%5Bedit%5D
	 */
	public update(z: Vec) {
		const { F, H, Q, R, P, x } = this;

		// Predict
		const xPred = F.vecMul(x);
		const PPred = F.mtxMul(P).mtxMul(F.transpose()).add(Q);

		// Update
		// Innovation or measurement residual
		const y = z.sub(H.vecMul(xPred));

		// Kalman gain
		const K = PPred.mtxMul(H.transpose()).mtxMul(
			H.mtxMul(PPred).mtxMul(H.transpose()).add(R).inv()
		);

		// Posteriori state estimate
		const xEst = xPred.add(K.vecMul(y));

		// Posteriori estimate covariance
		const PEst = PPred.sub(K.mtxMul(H).mtxMul(PPred));

		// TODO add stable PEst matrix

		this.x = xEst;
		this.P = PEst;

		this._history.push(xEst);

		xEst.print();

		console.log("------\n-----\n");

		return xEst;
	}

	get state() {
		return this.x;
	}

	get history() {
		return this._history;
	}

	set QMatrix(Q: Matrix) {
		this.Q = Q;
	}

	get QMatrix() {
		return this.Q;
	}

	set RMatrix(R: Matrix) {
		this.R = R;
	}

	set HMatrix(H: Matrix) {
		this.H = H;
	}

	set FMatrix(F: Matrix) {
		this.F = F;
	}

	get FMatrix() {
		return this.F;
	}
}
