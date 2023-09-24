import { IHitRecord } from '../interfaces/hit-record.interface';
import { IMaterial } from '../interfaces/material.interface';
import { Ray } from './ray';
import { Vec3 } from './vec3';
import { Color } from '../types/vec3.types';

export class Metal implements IMaterial {
  albedo: Color;

  fuzz: number;

  constructor(albedo: Color, fuzz = 1) {
    this.albedo = albedo;
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }

  scatter(
    rayIn: Ray,
    hitRecord: IHitRecord,
    attenuation: Vec3,
    scattered: Ray,
  ): boolean {
    const reflected = Vec3.reflect(
      rayIn.direction.unitVector(),
      hitRecord.normal,
    );
    Object.assign(
      scattered,
      new Ray(
        hitRecord.p,
        reflected.add(Vec3.randomInUnitSphere().multiply(this.fuzz)),
      ),
    );
    Object.assign(attenuation, this.albedo);
    return true;
  }
}
