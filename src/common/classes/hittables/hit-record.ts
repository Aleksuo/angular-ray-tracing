import { HittableType } from 'src/common/interfaces/hittable.interface';
import { IHitRecord } from '../../interfaces/hit-record.interface';
import { IMaterial } from '../../interfaces/material.interface';
import { Ray } from '../utilities/ray';
import { Vec3 } from '../utilities/vec3';

export class HitRecord implements IHitRecord {
  p: Vec3;

  normal: Vec3;

  t: number;

  frontFace: boolean;

  material!: IMaterial;

  constructor() {
    this.p = new Vec3();
    this.normal = new Vec3();
    this.t = 0;
    this.frontFace = false;
  }

  setFaceNormal(ray: Ray, outwardNormal: Vec3): void {
    this.frontFace = ray.direction.dot(outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : outwardNormal.negate();
  }
}
