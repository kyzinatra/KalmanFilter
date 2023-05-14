import { Matrix } from "../models/utils/Matrix";

export function getQMatrix(dt: number, sigma: number) {
	const p = dt ** 4 / 4;
	const f = dt ** 3 / 2;
	const a = dt ** 2 / 2;
	const b = a * 2;
	return new Matrix(9, 9, [
		[p, 0, 0, f, 0, 0, a, 0, 0],
		[0, p, 0, 0, f, 0, 0, a, 0],
		[0, 0, p, 0, 0, f, 0, 0, a],
		[f, 0, 0, b, 0, 0, dt, 0, 0],
		[0, f, 0, 0, b, 0, 0, dt, 0],
		[0, 0, f, 0, 0, b, 0, 0, dt],
		[a, 0, 0, dt, 0, 0, 1, 0, 0],
		[0, a, 0, 0, dt, 0, 0, 1, 0],
		[0, 0, a, 0, 0, dt, 0, 0, 1],
	]).mul(sigma ** 2);
}

export function getRMatrix(sigma: number) {
	return Matrix.GetIdentity(3, 3).mul(sigma ** 2);
}
export function getPMatrix(sigma: number) {
	return Matrix.GetIdentity(9, 9).mul(sigma ** 2);
}

export function getFMatrix(t: number) {
	const a = t ** 2 / 2;
	return new Matrix(9, 9, [
		[1, 0, 0, t, 0, 0, a, 0, 0],
		[0, 1, 0, 0, t, 0, 0, a, 0],
		[0, 0, 1, 0, 0, t, 0, 0, a],
		[0, 0, 0, 1, 0, 0, t, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, t, 0],
		[0, 0, 0, 0, 0, 1, 0, 0, t],
		[0, 0, 0, 0, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1],
	]);
}

export function getHMatrix() {
	return new Matrix(3, 9, [
		[1, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 0, 0, 0],
	]);
}
