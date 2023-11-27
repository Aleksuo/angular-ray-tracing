import { IHitRecord } from '../../interfaces/hit-record.interface';
import { HittableType, IHittable } from '../../interfaces/hittable.interface';
import { HitRecord } from './hit-record';
import { Interval } from '../utilities/interval';
import { Ray } from '../utilities/ray';

export class HittableList implements IHittable {
  objects: IHittable[];

  type: HittableType = 'hittableList';

  constructor() {
    this.objects = [];
  }

  add(object: IHittable): void {
    this.objects.push(object);
  }

  hit(ray: Ray, rayT: Interval, hitRecord: IHitRecord): boolean {
    const tempHitRecord: IHitRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = rayT.max;

    for (let i = 0; i < this.objects.length; i += 1) {
      if (
        this.objects[i].hit(
          ray,
          new Interval(rayT.min, closestSoFar),
          tempHitRecord,
        )
      ) {
        hitAnything = true;
        closestSoFar = tempHitRecord.t;
        Object.assign(hitRecord, tempHitRecord);
      }
    }

    return hitAnything;
  }
}
