import { randomRange } from '../../utilities/math.util';

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

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
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

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
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

  static randomInUnitDisk(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = new Vec3(randomRange(-1, 1), randomRange(-1, 1), 0);
      if (p.lengthSquared() < 1) return p;
    }
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

  static refract(uv: Vec3, n: Vec3, etaiOverEtat: number): Vec3 {
    const cosTheta = Math.min(uv.negate().dot(n), 1);
    const routPerp = uv.add(n.multiply(cosTheta)).multiply(etaiOverEtat);
    const routParallel = n.multiply(
      -Math.sqrt(Math.abs(1 - routPerp.lengthSquared())),
    );
    return routPerp.add(routParallel);
  }
}
