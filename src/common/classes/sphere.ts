import { IHitRecord } from '../interfaces/hit-record.interface';
import { IHittable } from '../interfaces/hittable.interface';
import { Point3 } from '../types/vec3.types';
import { Ray } from './ray';
import { Interval } from './interval';
import { IMaterial } from '../interfaces/material.interface';

export class Sphere implements IHittable {
  center: Point3;

  radius: number;

  material: IMaterial;

  constructor(center: Point3, radius: number, material: IMaterial) {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(ray: Ray, rayT: Interval, hitRecord: IHitRecord): boolean {
    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.dot(ray.direction);
    const halfB = oc.dot(ray.direction);
    const c = oc.dot(oc) - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;

    if (discriminant < 0) {
      return false;
    }

    const sqrtd = Math.sqrt(discriminant);

    let root = (-halfB - sqrtd) / a;
    if (!rayT.surrounds(root)) {
      root = (-halfB + sqrtd) / a;
      if (!rayT.surrounds(root)) {
        return false;
      }
    }

    hitRecord.t = root;
    hitRecord.p = ray.at(hitRecord.t);
    const outwardNormal = hitRecord.p.subtract(this.center).divide(this.radius);
    hitRecord.setFaceNormal(ray, outwardNormal);
    hitRecord.material = this.material;

    return true;
  }
}
