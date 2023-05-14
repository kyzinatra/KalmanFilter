export type TSimpleVec = number[];
export class Vec {
	private vec: TSimpleVec;
	constructor(...vec: TSimpleVec) {
		this.vec = vec;
	}

	reverse() {
		const coords = [...this.coords];
		this.fill((i) => coords[coords.length - 1 - i]);
		return this;
	}
	add(vec2: Vec) {
		if (this.length !== vec2.length) throw new RangeError("You can only add equally sized vectors");
		return new Vec(...this.vec.map((c, i) => c + vec2.coords[i]));
	}

	fill(callback: (i: number, value: number) => number) {
		this.vec.forEach((val, i) => {
			this.vec[i] = callback(i, val);
		});
		return this;
	}

	sub(vec2: Vec) {
		if (this.length !== vec2.length)
			throw new RangeError("You can only subtract equally sized vectors");
		return new Vec(...this.vec.map((c, i) => c - vec2.coords[i]));
	}

	mul(factor: Vec | number) {
		if (typeof factor === "number") return new Vec(...this.vec.map((c) => c * factor));

		if (this.vec.length !== factor.coords.length)
			throw new RangeError("You can only multiply equally sized vectors");
		return new Vec(...this.vec.map((c, i) => c * factor.coords[i]));
	}

	lorentzianProduct(factor: Vec) {
		if (this.vec.length !== factor.coords.length)
			throw new RangeError("You can only multiply equally sized vectors");
		return this.vec
			.map((c, i) => c * factor.coords[i])
			.reduce((s, el, i, arr) => (arr.length === i + 1 ? s - el : s + el), 0);
	}

	get mod() {
		return Math.sqrt(this.vec.reduce((sum, el) => sum + el ** 2, 0));
	}

	cut(length: number) {
		this.vec.length = length;
		return this;
	}

	get coords() {
		return this.vec;
	}

	get length() {
		return this.vec.length;
	}

	set(index: number, value: number) {
		this.vec[index] = value;
	}

	addToCoord(index: number, value: number) {
		if (!this.vec[index]) this.vec[index] = 0;
		this.vec[index] += value;
	}

	print() {
		console.table(this.vec);
	}
}
