import { Point3 } from '../../types/vec3.types';
import { Vec3 } from './vec3';

export class Ray {
  origin: Point3;

  direction: Vec3;

  constructor(origin = new Vec3(), direction = new Vec3()) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t: number): Point3 {
    return this.direction.multiply(t).add(this.origin);
  }
}
