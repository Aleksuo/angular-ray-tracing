import { Point3 } from '../types/vec3.types';
import { Vec3 } from '../classes/vec3';
import { Ray } from '../classes/ray';
// eslint-disable-next-line import/no-cycle
import { IMaterial } from './material.interface';

export interface IHitRecord {
  p: Point3;
  normal: Vec3;
  t: number;
  frontFace: boolean;
  material: IMaterial;
  setFaceNormal(ray: Ray, outwardNormal: Vec3): void;
}
