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

	constructor(settings: TInputData) {
		this.F = settings.F;
		this.H = settings.H;
		this.Q = settings.Q;
		this.R = settings.R;
		this.P = settings.P;
		this.x = settings.x;
	}

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
			H.mtxMul(PPred).mtxMul(H.transpose()).add(R).inverseDiagonal()
		);

		// Posteriori state estimate
		const xEst = xPred.add(K.vecMul(y));

		// Posteriori estimate covariance
		const PEst = PPred.sub(K.mtxMul(H).mtxMul(PPred));

		this.x = xEst;
		this.P = PEst;

		return xEst;
	}

	get state() {
		return this.x;
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
