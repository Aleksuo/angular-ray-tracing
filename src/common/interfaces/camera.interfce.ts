import { IHittable } from './hittable.interface';

export interface ICamera<T> {
  aspectRatio: number;
  imageWidth: number;
  imageHeight: number;
  initialize(): void;
  render(world: IHittable): T;
}
