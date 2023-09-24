import { ICamera } from '../interfaces/camera.interfce';
import { IHittable } from '../interfaces/hittable.interface';
import { Color, Point3 } from '../types/vec3.types';
import { Vec3 } from './vec3';
import { Ray } from './ray';
import { Interval } from './interval';
import { HitRecord } from './hit-record';
import { IHitRecord } from '../interfaces/hit-record.interface';

export class RayTracingCamera implements ICamera<ImageData> {
  aspectRatio!: number;

  imageWidth!: number;

  imageHeight!: number;

  samplesPerPixel: number = 1;

  private center!: Point3;

  private pixel00Location!: Point3;

  private pixelDeltaU!: Vec3;

  private pixelDeltaV!: Vec3;

  private imgData!: ImageData;

  initialize(): void {
    this.imageHeight = Math.floor(this.imageWidth / this.aspectRatio);
    this.imageHeight = this.imageHeight < 1 ? 1 : this.imageHeight;

    const focalLength = 1.0;
    const viewportHeight = 2.0;
    const viewportWidth =
      viewportHeight * (Math.floor(this.imageWidth) / this.imageHeight);
    this.center = new Vec3(0, 0, 0);

    const viewportU = new Vec3(viewportWidth, 0, 0);
    const viewportV = new Vec3(0, -viewportHeight, 0);

    this.pixelDeltaU = viewportU.divide(this.imageWidth);
    this.pixelDeltaV = viewportV.divide(this.imageHeight);

    const viewportUpperLeft = this.center
      .subtract(viewportU.divide(2))
      .subtract(viewportV.divide(2))
      .subtract(new Vec3(0, 0, focalLength));

    this.pixel00Location = this.pixelDeltaU
      .add(this.pixelDeltaV)
      .multiply(0.5)
      .add(viewportUpperLeft);

    this.imgData = new ImageData(this.imageWidth, this.imageHeight);
  }

  render(world: IHittable): ImageData {
    for (let j = 0; j < this.imageHeight; j += 1) {
      for (let i = 0; i < this.imageWidth; i += 1) {
        const index = (j * this.imageWidth + i) * 4;
        let pixelColor = new Vec3(0, 0, 0);
        for (let s = 0; s < this.samplesPerPixel; s += 1) {
          const r = this.getRay(i, j);
          pixelColor = pixelColor.add(this.rayColor(r, world));
        }
        this.drawPixel(index, pixelColor, this.samplesPerPixel);
      }
    }
    return this.imgData;
  }

  getRay(i: number, j: number): Ray {
    const pixelCenter = this.pixel00Location
      .add(this.pixelDeltaU.multiply(i))
      .add(this.pixelDeltaV.multiply(j));
    const pixelSample = pixelCenter.add(this.pixelSampleSquare());
    const rayDirection = pixelSample.subtract(this.center);

    return new Ray(this.center, rayDirection);
  }

  rayColor(ray: Ray, world: IHittable): Color {
    const hitRecord: IHitRecord = new HitRecord();
    if (world.hit(ray, new Interval(0, Number.POSITIVE_INFINITY), hitRecord)) {
      return hitRecord.normal
        .add(new Vec3(1, 1, 1))
        .multiply(0.5)
        .multiply(255);
    }

    const unitDirection = ray.direction.unitVector();
    const a = 0.5 * (unitDirection.y + 1.0);

    return new Vec3(1.0, 1.0, 1.0)
      .multiply(1.0 - a)
      .add(new Vec3(0.5, 0.7, 1.0).multiply(a))
      .multiply(255);
  }

  pixelSampleSquare(): Vec3 {
    const px = -0.5 + Math.random();
    const py = -0.5 + Math.random();
    return this.pixelDeltaU.multiply(px).add(this.pixelDeltaV.multiply(py));
  }

  drawPixel(index: number, pixelColor: Color, samplesPerPixel: number): void {
    const scale = 1.0 / samplesPerPixel;
    const r = pixelColor.x * scale;
    const g = pixelColor.y * scale;
    const b = pixelColor.z * scale;

    this.imgData.data[index] = r;
    this.imgData.data[index + 1] = g;
    this.imgData.data[index + 2] = b;
    this.imgData.data[index + 3] = 255;
  }
}
