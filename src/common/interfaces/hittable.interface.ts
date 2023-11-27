import { IHitRecord } from './hit-record.interface';
import { Ray } from '../classes/utilities/ray';
import { Interval } from '../classes/utilities/interval';

export type HittableType = 'sphere' | 'hittableList';
export interface IHittable {
  type: HittableType;
  hit(ray: Ray, rayT: Interval, hitRecord: IHitRecord): boolean;
}
