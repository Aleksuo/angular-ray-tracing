/// <reference lib="webworker" />

import { Sphere } from '../classes/geometry/sphere';
import { HitRecord } from '../classes/hittables/hit-record';
import { HittableList } from '../classes/hittables/hittable-list';
import { Dielectric } from '../classes/materials/dielectric';
import { Lambertian } from '../classes/materials/lambertian';
import { Metal } from '../classes/materials/metal';
import { Interval } from '../classes/utilities/interval';
import { Ray } from '../classes/utilities/ray';
import { Vec3 } from '../classes/utilities/vec3';
import { IHitRecord } from '../interfaces/hit-record.interface';
import { IHittable } from '../interfaces/hittable.interface';
import { IMaterial } from '../interfaces/material.interface';
import { RayTracingWorkerDataInterface } from '../interfaces/ray-tracing-worker-data.interface';
import { Color, Point3 } from '../types/vec3.types';

interface RayTracingWorkerOutputData {
  rowIndex: number;
  rowImgData: number[];
}

const rayColor = (
  ray: Ray,
  world: IHittable,
  depth: number,
  skyBoxColor: Color,
): Color => {
  const hitRecord: IHitRecord = new HitRecord();
  if (depth <= 0) {
    return new Vec3(0, 0, 0);
  }
  if (
    world.hit(ray, new Interval(0.001, Number.POSITIVE_INFINITY), hitRecord)
  ) {
    const scattered = new Ray();
    const attenuation = new Vec3();
    if (hitRecord.material.scatter(ray, hitRecord, attenuation, scattered)) {
      return attenuation.vectorMultiply(
        rayColor(scattered, world, depth - 1, skyBoxColor),
      );
    }
    return new Vec3(0, 0, 0);
  }

  const unitDirection = ray.direction.unitVector();
  const a = 0.5 * (unitDirection.y + 1.0);

  return new Vec3(1.0, 1.0, 1.0).multiply(1.0 - a).add(skyBoxColor.multiply(a));
};

const pixelSampleSquare = (pixelDeltaU: Vec3, pixelDeltaV: Vec3): Vec3 => {
  const px = -0.5 + Math.random();
  const py = -0.5 + Math.random();
  return pixelDeltaU.multiply(px).add(pixelDeltaV.multiply(py));
};

const defocusDiskSample = (
  center: Vec3,
  defocusDiskU: Vec3,
  defocusDiskV: Vec3,
): Point3 => {
  const p = Vec3.randomInUnitDisk();
  return center.add(defocusDiskU.multiply(p.x)).add(defocusDiskV.multiply(p.y));
};

const getRay = (
  i: number,
  j: number,
  defocusAngle: number,
  pixel00Location: Vec3,
  pixelDeltaU: Vec3,
  pixelDeltaV: Vec3,
  center: Vec3,
  defocusDiskU: Vec3,
  defocusDiskV: Vec3,
): Ray => {
  const pixelCenter = pixel00Location
    .add(pixelDeltaU.multiply(i))
    .add(pixelDeltaV.multiply(j));
  const pixelSample = pixelCenter.add(
    pixelSampleSquare(pixelDeltaU, pixelDeltaV),
  );

  const rayOrigin =
    defocusAngle <= 0
      ? center
      : defocusDiskSample(center, defocusDiskU, defocusDiskV);
  const rayDirection = pixelSample.subtract(rayOrigin);

  return new Ray(center, rayDirection);
};

const linearToGamma = (linearComponent: number): number =>
  Math.sqrt(linearComponent);

const drawPixel = (
  pixelColor: Color,
  samplesPerPixel: number,
  intensity: Interval,
  rowImgData: number[],
): void => {
  const scale = 1.0 / samplesPerPixel;
  let r = pixelColor.x * scale;
  let g = pixelColor.y * scale;
  let b = pixelColor.z * scale;

  r = linearToGamma(r);
  g = linearToGamma(g);
  b = linearToGamma(b);

  rowImgData.push(255 * intensity.clamp(r));
  rowImgData.push(255 * intensity.clamp(g));
  rowImgData.push(255 * intensity.clamp(b));
  rowImgData.push(255);
};

const returnVec3Prototype = (obj: Vec3): void => {
  Object.setPrototypeOf(obj, Vec3.prototype);
};

const returnIntervalPrototype = (obj: Interval): void => {
  Object.setPrototypeOf(obj, Interval.prototype);
};

const returnHittableListPrototype = (obj: HittableList) => {
  Object.setPrototypeOf(obj, HittableList.prototype);
  obj.objects.forEach((element) => {
    returnHittablePrototype(element);
  });
};

const returnSpherePrototype = (obj: Sphere) => {
  Object.setPrototypeOf(obj, Sphere.prototype);
  returnVec3Prototype(obj.center);
  returnMaterialPrototype(obj.material);
};

const returnHittablePrototype = (obj: IHittable): void => {
  switch (obj.type) {
    case 'hittableList':
      returnHittableListPrototype(obj as HittableList);
      break;
    case 'sphere':
      returnSpherePrototype(obj as Sphere);
      break;
    default:
      console.error(`Unsupported type: ${obj.type}`);
      break;
  }
};

const returnMaterialPrototype = (obj: IMaterial): void => {
  switch (obj.type) {
    case 'dielectric':
      Object.setPrototypeOf(obj, Dielectric.prototype);
      break;
    case 'lambertian':
      Object.setPrototypeOf(obj, Lambertian.prototype);
      break;
    case 'metal':
      Object.setPrototypeOf(obj, Metal.prototype);
      break;
    default:
      console.error(`Unsupported type: ${obj.type}`);
      break;
  }
};

const returnDataPrototype = (obj: RayTracingWorkerDataInterface): void => {
  returnVec3Prototype(obj.pixel00Location);
  returnVec3Prototype(obj.pixelDeltaU);
  returnVec3Prototype(obj.pixelDeltaV);
  returnVec3Prototype(obj.center);
  returnVec3Prototype(obj.defocusDiskU);
  returnVec3Prototype(obj.defocusDiskV);
  returnVec3Prototype(obj.skyBoxColor);
  returnIntervalPrototype(obj.intensity);
  returnHittablePrototype(obj.world);
};

const renderRow = (
  workerData: RayTracingWorkerDataInterface,
): RayTracingWorkerOutputData => {
  const {
    rowIndex,
    imageWidth,
    samplesPerPixel,
    pixel00Location,
    pixelDeltaU,
    pixelDeltaV,
    defocusAngle,
    world,
    center,
    maxDepth,
    defocusDiskU,
    defocusDiskV,
    skyBoxColor,
    intensity,
  } = workerData;
  const rowImgData: number[] = [];
  for (let i = 0; i < imageWidth; i += 1) {
    let pixelColor = new Vec3(0, 0, 0);
    for (let s = 0; s < samplesPerPixel; s += 1) {
      const r = getRay(
        i,
        rowIndex,
        defocusAngle,
        pixel00Location,
        pixelDeltaU,
        pixelDeltaV,
        center,
        defocusDiskU,
        defocusDiskV,
      );
      pixelColor = pixelColor.add(rayColor(r, world, maxDepth, skyBoxColor));
    }
    drawPixel(pixelColor, samplesPerPixel, intensity, rowImgData);
  }
  return {
    rowImgData,
    rowIndex,
  };
};

// eslint-disable-next-line no-restricted-globals
addEventListener('message', ({ data }) => {
  returnDataPrototype(data);
  postMessage(renderRow(data));
});
