import { IHitRecord } from '../../interfaces/hit-record.interface';
import { IMaterial } from '../../interfaces/material.interface';
import { Color } from '../../types/vec3.types';
import { Ray } from '../utilities/ray';
import { Vec3 } from '../utilities/vec3';

export class Lambertian implements IMaterial {
  albedo: Color;

  constructor(albedo: Color) {
    this.albedo = albedo;
  }

  scatter(
    rayIn: Ray,
    hitRecord: IHitRecord,
    attenuation: Vec3,
    scattered: Ray,
  ): boolean {
    let scatterDirection = hitRecord.normal.add(Vec3.randomUnitVector());
    if (scatterDirection.nearZero()) scatterDirection = hitRecord.normal;
    Object.assign(scattered, new Ray(hitRecord.p, scatterDirection));
    Object.assign(attenuation, this.albedo);
    return true;
  }
}
