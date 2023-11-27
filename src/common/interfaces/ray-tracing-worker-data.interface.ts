import { Interval } from '../classes/utilities/interval';
import { Vec3 } from '../classes/utilities/vec3';
import { Color } from '../types/vec3.types';
import { IHittable } from './hittable.interface';

export interface RayTracingWorkerDataInterface {
  rowIndex: number;
  imageWidth: number;
  samplesPerPixel: number;
  pixel00Location: Vec3;
  defocusAngle: number;
  pixelDeltaU: Vec3;
  pixelDeltaV: Vec3;
  world: IHittable;
  center: Vec3;
  maxDepth: number;
  defocusDiskU: Vec3;
  defocusDiskV: Vec3;
  skyBoxColor: Color;
  intensity: Interval;
}
