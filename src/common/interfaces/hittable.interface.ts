import { IHitRecord } from './hit-record.interface';
import { Ray } from '../classes/utilities/ray';
import { Interval } from '../classes/utilities/interval';

export interface IHittable {
  hit(ray: Ray, rayT: Interval, hitRecord: IHitRecord): boolean;
}
