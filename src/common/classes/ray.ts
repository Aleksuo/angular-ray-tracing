import { Point3 } from '../types/vec3.types';
import { Vec3 } from './vec3';
import { Vec3Utils } from '../utils/vec3.utils';

export class Ray {
  origin: Point3;

  direction: Vec3;

  constructor(origin: Point3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t: number): Point3 {
    return Vec3Utils.add(this.origin, Vec3Utils.multiply(t, this.direction));
  }
}
