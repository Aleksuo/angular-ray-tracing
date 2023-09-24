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
        const pixelCenter = this.pixel00Location
          .add(this.pixelDeltaU.multiply(i))
          .add(this.pixelDeltaV.multiply(j));
        const rayDirection = pixelCenter.subtract(this.center);
        const index = (j * this.imageWidth + i) * 4;

        const r = new Ray(this.center, rayDirection);
        const pixelColor = this.rayColor(r, world);

        this.drawPixel(index, pixelColor);
      }
    }
    return this.imgData;
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

  drawPixel(index: number, pixelColor: Color): void {
    this.imgData.data[index] = pixelColor.x;
    this.imgData.data[index + 1] = pixelColor.y;
    this.imgData.data[index + 2] = pixelColor.z;
    this.imgData.data[index + 3] = 255;
  }
}
