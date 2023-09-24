import { Ray } from '../classes/ray';
// eslint-disable-next-line import/no-cycle
import { IHitRecord } from './hit-record.interface';
import { Color } from '../types/vec3.types';

export interface IMaterial {
  scatter(
    rayIn: Ray,
    hitRecord: IHitRecord,
    attenuation: Color,
    scattered: Ray,
  ): boolean;
}
