import { IHittable } from './hittable.interface';

export interface ICamera<T> {
  aspectRatio: number;
  imageWidth: number;
  imageHeight: number;
  samplesPerPixel: number;
  setCameraSettings: (settings: any) => void;
  getCameraSettings: () => any;
  initialize(): void;
  render(world: IHittable): T;
}
