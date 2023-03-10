export type TSimpleVec = number[];
export class Vec {
  private vec: TSimpleVec;
  constructor(...vec: TSimpleVec) {
    this.vec = vec;
  }

  add(vec2: Vec) {
    if (this.vec.length !== vec2.cords.length) throw RangeError("You can only add equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c + vec2.cords[i]));
  }

  sub(vec2: Vec) {
    if (this.vec.length !== vec2.cords.length) throw RangeError("You can only subtract equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c - vec2.cords[i]));
  }

  mul(factor: Vec | number) {
    if (typeof factor === "number") return new Vec(...this.vec.map(c => c * factor));

    if (this.vec.length !== factor.cords.length) throw RangeError("You can only multiply equally sized vectors");
    return new Vec(...this.vec.map((c, i) => c * factor.cords[i]));
  }

  get mod() {
    return Math.sqrt(this.vec.reduce((sum, el) => sum + el ** 2, 0));
  }

  get cords() {
    return this.vec;
  }
}
