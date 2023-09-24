import { randomRange } from '../utilities/math.util';

export class Vec3 {
  x: number;

  y: number;

  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  vectorMultiply(v: Vec3): Vec3 {
    return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
  }

  multiply(num: number): Vec3 {
    return new Vec3(this.x * num, this.y * num, this.z * num);
  }

  divide(num: number): Vec3 {
    return new Vec3(this.x / num, this.y / num, this.z / num);
  }

  negate(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  unitVector(): Vec3 {
    return this.divide(this.length());
  }

  nearZero(): boolean {
    const s = 1e-8;
    return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
  }

  static randomUnitVector(): Vec3 {
    return Vec3.randomInUnitSphere().unitVector();
  }

  static randomInUnitSphere(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = Vec3.random(-1, 1);
      if (p.lengthSquared() < 1) return p;
    }
  }

  static randomOnHemisphere(normal: Vec3): Vec3 {
    const onUnitSphere = Vec3.randomUnitVector();
    if (onUnitSphere.dot(normal) > 0) {
      return onUnitSphere;
    }
    return onUnitSphere.negate();
  }

  static random(min = 0, max = 1): Vec3 {
    return new Vec3(
      randomRange(min, max),
      randomRange(min, max),
      randomRange(min, max),
    );
  }

  static reflect(v: Vec3, n: Vec3): Vec3 {
    return v.subtract(n.multiply(v.dot(n) * 2));
  }
}
