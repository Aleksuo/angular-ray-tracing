import { IHitRecord } from '../interfaces/hit-record.interface';
import { IMaterial } from '../interfaces/material.interface';
import { Ray } from './ray';
import { Vec3 } from './vec3';

export class Dielectric implements IMaterial {
  ir: number;

  constructor(indexOfRefraction: number) {
    this.ir = indexOfRefraction;
  }

  scatter(
    rayIn: Ray,
    hitRecord: IHitRecord,
    attenuation: Vec3,
    scattered: Ray,
  ): boolean {
    Object.assign(attenuation, new Vec3(1.0, 1.0, 1.0));
    const refractionRatio = hitRecord.frontFace ? 1.0 / this.ir : this.ir;

    const unitDirection = rayIn.direction.unitVector();
    const cosTheta = Math.min(
      unitDirection.negate().dot(hitRecord.normal),
      1.0,
    );
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

    const cannotRefract = refractionRatio * sinTheta > 1.0;
    let direction: Vec3;
    if (
      cannotRefract ||
      this.reflectance(cosTheta, refractionRatio) > Math.random()
    ) {
      direction = Vec3.reflect(unitDirection, hitRecord.normal);
    } else {
      direction = Vec3.refract(
        unitDirection,
        hitRecord.normal,
        refractionRatio,
      );
    }
    const refracted = Vec3.refract(
      unitDirection,
      hitRecord.normal,
      refractionRatio,
    );

    Object.assign(scattered, new Ray(hitRecord.p, refracted));
    return true;
  }

  private reflectance(cosine: number, refIdx: number): number {
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 *= r0;
    return r0 + (1 - r0) * (1 - cosine) ** 5;
  }
}
