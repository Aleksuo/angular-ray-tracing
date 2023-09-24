import { IHitRecord } from './hit-record.interface';
import { Ray } from '../classes/ray';
import { Interval } from '../classes/interval';

export interface IHittable {
  hit(ray: Ray, rayT: Interval, hitRecord: IHitRecord): boolean;
}
