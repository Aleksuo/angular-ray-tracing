import { IHitRecord } from 'src/common/interfaces/hit-record.interface';
import { Color } from 'src/common/types/vec3.types';
import { RandomFn, createNoise3D, NoiseFunction3D } from 'simplex-noise';
import { IMaterial, MaterialType } from '../../interfaces/material.interface';
import { Ray } from '../utilities/ray';
import { Vec3 } from '../utilities/vec3';

export class Marble implements IMaterial {
  albedo_stripe: Color;

  albedo_base: Color;

  type: MaterialType = 'marble';

  noiseSeed: number;

  noiseFn!: NoiseFunction3D;

  constructor(albedo_stripe: Color, albedo_base: Color, noiseSeed: number) {
    this.albedo_stripe = albedo_stripe;
    this.albedo_base = albedo_base;
    this.noiseSeed = noiseSeed;
  }

  scatter(
    rayIn: Ray,
    hitRecord: IHitRecord,
    attenuation: Vec3,
    scattered: Ray,
  ): boolean {
    this.instantiateNoiseFnIfNotDefined();
    let scatterDirection = hitRecord.normal.add(Vec3.randomUnitVector());
    if (scatterDirection.nearZero()) scatterDirection = hitRecord.normal;
    Object.assign(scattered, new Ray(hitRecord.p, scatterDirection));
    Object.assign(attenuation, this.sampleMarble(hitRecord.p));
    return true;
  }

  turbulence(p: Vec3, pixel_size: number): number {
    let x = 0;
    let scale = 1;
    let tempP = new Vec3(p.x, p.y, p.z);
    while (scale > pixel_size) {
      tempP = tempP.divide(scale);
      x += this.noiseFn(tempP.x, tempP.y, tempP.z) * scale;
      scale /= 2;
    }
    return x;
  }

  sampleMarble(p: Vec3): Color {
    const color = new Vec3(0, 0, 0);
    let x = Math.sin((p.y + 3 * this.turbulence(p, 0.00125)) * Math.PI);
    x = Math.sqrt(x + 1) * 0.7071;
    color.y = this.albedo_stripe.y + this.albedo_base.y * x;
    x = Math.sqrt(x);
    color.x = this.albedo_stripe.x + this.albedo_base.x * x;
    color.z = this.albedo_stripe.z + this.albedo_base.z * x;
    return color;
  }

  // Functions cannot be passed to workers, so we need to instantiate the noise function in a bit of a hacky way.
  instantiateNoiseFnIfNotDefined() {
    if (!this.noiseFn) {
      const randFn: RandomFn = () => this.noiseSeed;
      this.noiseFn = createNoise3D(randFn);
    }
  }
}
