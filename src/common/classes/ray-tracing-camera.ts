import { Observable, generate, map, asyncScheduler } from 'rxjs';
import { ICamera } from '../interfaces/camera.interfce';
import { IHittable } from '../interfaces/hittable.interface';
import { Color, Point3 } from '../types/vec3.types';
import { Vec3 } from './vec3';
import { Ray } from './ray';
import { Interval } from './interval';
import { HitRecord } from './hit-record';
import { IHitRecord } from '../interfaces/hit-record.interface';
import { degreesToRadians } from '../utilities/math.util';

export class RayTracingCamera implements ICamera<Observable<ImageData>> {
  aspectRatio!: number;

  imageWidth!: number;

  imageHeight!: number;

  samplesPerPixel: number = 1;

  maxDepth: number = 10;

  vFov: number = 90;

  lookFrom: Point3 = new Vec3(0, 0, -1);

  lookAt: Point3 = new Vec3(0, 0, 0);

  vUp: Vec3 = new Vec3(0, 1, 0);

  defocusAngle = 0;

  focusDistance = 10;

  private center!: Point3;

  private pixel00Location!: Point3;

  private pixelDeltaU!: Vec3;

  private pixelDeltaV!: Vec3;

  private imgData!: ImageData;

  private intensity: Interval = new Interval(0, 0.999);

  private w!: Vec3;

  private u!: Vec3;

  private v!: Vec3;

  private defocusDiskU!: Vec3;

  private defocusDiskV!: Vec3;

  setSettings(settings: any): void {
    this.samplesPerPixel = settings.samplesPerPixel;
    this.maxDepth = settings.maxDepth;
    this.initialize();
  }

  initialize(): void {
    this.imageHeight = Math.floor(this.imageWidth / this.aspectRatio);
    this.imageHeight = this.imageHeight < 1 ? 1 : this.imageHeight;

    const theta = degreesToRadians(this.vFov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2.0 * h * this.focusDistance;
    const viewportWidth =
      viewportHeight * (Math.floor(this.imageWidth) / this.imageHeight);

    this.center = this.lookFrom;

    this.w = this.lookFrom.subtract(this.lookAt).unitVector();
    this.u = this.vUp.cross(this.w).unitVector();
    this.v = this.w.cross(this.u);

    const viewportU = this.u.multiply(viewportWidth);
    const viewportV = this.v.negate().multiply(viewportHeight);

    this.pixelDeltaU = viewportU.divide(this.imageWidth);
    this.pixelDeltaV = viewportV.divide(this.imageHeight);

    const viewportUpperLeft = this.center
      .subtract(viewportU.divide(2))
      .subtract(viewportV.divide(2))
      .subtract(this.w.multiply(this.focusDistance));

    this.pixel00Location = this.pixelDeltaU
      .add(this.pixelDeltaV)
      .multiply(0.5)
      .add(viewportUpperLeft);

    const defocusRadius =
      this.focusDistance * Math.tan(degreesToRadians(this.defocusAngle / 2));
    this.defocusDiskU = this.u.multiply(defocusRadius);
    this.defocusDiskV = this.v.multiply(defocusRadius);

    this.imgData = new ImageData(this.imageWidth, this.imageHeight);
    this.imgData.data.fill(0);
  }

  render(world: IHittable): Observable<ImageData> {
    return generate(
      0,
      (j) => j < this.imageHeight,
      (j) => j + 1,
      asyncScheduler,
    ).pipe(map((j) => this.renderRow(j, world)));
  }

  private renderRow(j: number, world: IHittable): ImageData {
    for (let i = 0; i < this.imageWidth; i += 1) {
      const index = (j * this.imageWidth + i) * 4;
      let pixelColor = new Vec3(0, 0, 0);
      for (let s = 0; s < this.samplesPerPixel; s += 1) {
        const r = this.getRay(i, j);
        pixelColor = pixelColor.add(this.rayColor(r, world, this.maxDepth));
      }
      this.drawPixel(index, pixelColor, this.samplesPerPixel);
    }
    return this.imgData;
  }

  getRay(i: number, j: number): Ray {
    const pixelCenter = this.pixel00Location
      .add(this.pixelDeltaU.multiply(i))
      .add(this.pixelDeltaV.multiply(j));
    const pixelSample = pixelCenter.add(this.pixelSampleSquare());

    const rayOrigin =
      this.defocusAngle <= 0 ? this.center : this.defocusDiskSample();
    const rayDirection = pixelSample.subtract(rayOrigin);

    return new Ray(this.center, rayDirection);
  }

  defocusDiskSample(): Point3 {
    const p = Vec3.randomInUnitDisk();
    return this.center
      .add(this.defocusDiskU.multiply(p.x))
      .add(this.defocusDiskV.multiply(p.y));
  }

  rayColor(ray: Ray, world: IHittable, depth: number): Color {
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
          this.rayColor(scattered, world, depth - 1),
        );
      }
      return new Vec3(0, 0, 0);
    }

    const unitDirection = ray.direction.unitVector();
    const a = 0.5 * (unitDirection.y + 1.0);

    return new Vec3(1.0, 1.0, 1.0)
      .multiply(1.0 - a)
      .add(new Vec3(0.5, 0.7, 1.0).multiply(a));
  }

  pixelSampleSquare(): Vec3 {
    const px = -0.5 + Math.random();
    const py = -0.5 + Math.random();
    return this.pixelDeltaU.multiply(px).add(this.pixelDeltaV.multiply(py));
  }

  linearToGamma(linearComponent: number): number {
    return Math.sqrt(linearComponent);
  }

  drawPixel(index: number, pixelColor: Color, samplesPerPixel: number): void {
    const scale = 1.0 / samplesPerPixel;
    let r = pixelColor.x * scale;
    let g = pixelColor.y * scale;
    let b = pixelColor.z * scale;

    r = this.linearToGamma(r);
    g = this.linearToGamma(g);
    b = this.linearToGamma(b);

    this.imgData.data[index] = 255 * this.intensity.clamp(r);
    this.imgData.data[index + 1] = 255 * this.intensity.clamp(g);
    this.imgData.data[index + 2] = 255 * this.intensity.clamp(b);
    this.imgData.data[index + 3] = 255;
  }
}
