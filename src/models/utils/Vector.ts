export type TSimpleVec = number[];
export class Vec {
  private vec: TSimpleVec;
  constructor(...vec: TSimpleVec) {
    this.vec = vec;
  }

  add(vec2: Vec) {
    if (this.vec.length !== vec2.cords.length) throw new RangeError("You can only add equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c + vec2.cords[i]));
  }

  sub(vec2: Vec) {
    if (this.vec.length !== vec2.cords.length) throw new RangeError("You can only subtract equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c - vec2.cords[i]));
  }

  mul(factor: Vec | number) {
    if (typeof factor === "number") return new Vec(...this.vec.map(c => c * factor));

    if (this.vec.length !== factor.cords.length) throw new RangeError("You can only multiply equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c * factor.cords[i]));
  }

  lorentzianProduct(factor: Vec) {
    if (this.vec.length !== factor.cords.length) throw new RangeError("You can only multiply equally sized vectors");
    return this.vec
      .map((c, i) => c * factor.cords[i])
      .reduce((s, el, i, arr) => (arr.length === i + 1 ? s - el : s + el), 0);
  }

  get mod() {
    return Math.sqrt(this.vec.reduce((sum, el) => sum + el ** 2, 0));
  }

  get cords() {
    return this.vec;
  }

  get length() {
    return this.vec.length;
  }

  set(index: number, value: number) {
    this.vec[index] = value;
  }

  addToCord(index: number, value: number) {
    if (!this.vec[index]) this.vec[index] = 0;
    this.vec[index] += value;
  }

  print() {
    console.table(this.vec);
  }
}
