import { Observable, generate, map, asyncScheduler } from 'rxjs';
import { Settings } from 'src/app/settings-panel/settings-panel.component';
import { RayTracingWorkerDataInterface } from 'src/common/interfaces/ray-tracing-worker-data.interface';
import { Injectable } from '@angular/core';
import { RayTracingWorkerService } from 'src/common/services/ray-tracing-worker.service';
import { ICamera } from '../../interfaces/camera.interfce';
import { IHittable } from '../../interfaces/hittable.interface';
import { Color, Point3 } from '../../types/vec3.types';
import { Vec3 } from '../utilities/vec3';
import { Ray } from '../utilities/ray';
import { Interval } from '../utilities/interval';
import { HitRecord } from '../hittables/hit-record';
import { IHitRecord } from '../../interfaces/hit-record.interface';
import { degreesToRadians } from '../../utilities/math.util';

@Injectable({
  providedIn: 'root',
})
export class RayTracingCamera implements ICamera<Observable<ImageData>> {
  aspectRatio: number = 16.0 / 9.0;

  imageWidth: number = 1200;

  imageHeight!: number;

  samplesPerPixel: number = 1;

  maxDepth: number = 10;

  vFov: number = 90;

  lookFrom: Point3 = new Vec3(0, 0, -1);

  lookAt: Point3 = new Vec3(0, 0, 0);

  vUp: Vec3 = new Vec3(0, 1, 0);

  defocusAngle = 0;

  focusDistance = 10;

  skyBoxColor: Color = new Vec3(0.5, 0.7, 1.0);

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

  constructor(private rayTracingWorkerService: RayTracingWorkerService) {}

  setCameraSettings(settings: any): void {
    this.samplesPerPixel = settings.rayTracingSettings.samplesPerPixel;
    this.maxDepth = settings.rayTracingSettings.maxDepth;

    this.vFov = settings.cameraSettings.vFov;
    this.lookFrom = settings.cameraSettings.lookFrom.clone();
    this.lookAt = settings.cameraSettings.lookAt.clone();
    this.defocusAngle = settings.cameraSettings.defocusAngle;
    this.focusDistance = settings.cameraSettings.focusDistance;
    this.skyBoxColor = settings.otherSettings.skyBoxColor.clone();

    this.initialize();
  }

  getCameraSettings(): Settings {
    return {
      rayTracingSettings: {
        samplesPerPixel: this.samplesPerPixel,
        maxDepth: this.maxDepth,
      },
      cameraSettings: {
        vFov: this.vFov,
        lookFrom: this.lookFrom.clone(),
        lookAt: this.lookAt.clone(),
        defocusAngle: this.defocusAngle,
        focusDistance: this.focusDistance,
      },
      otherSettings: {
        skyBoxColor: this.skyBoxColor.clone(),
      },
    };
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
    const jobs: RayTracingWorkerDataInterface[] = [];
    for (let j = 0; j < this.imageHeight; j += 1) {
      const job: RayTracingWorkerDataInterface = {
        rowIndex: j,
        imageWidth: this.imageWidth,
        samplesPerPixel: this.samplesPerPixel,
        pixel00Location: this.pixel00Location,
        defocusAngle: this.defocusAngle,
        pixelDeltaU: this.pixelDeltaU.clone(),
        pixelDeltaV: this.pixelDeltaV.clone(),
        world,
        center: this.center.clone(),
        maxDepth: this.maxDepth,
        defocusDiskU: this.defocusDiskU.clone(),
        defocusDiskV: this.defocusDiskV.clone(),
        skyBoxColor: this.skyBoxColor.clone(),
        intensity: this.intensity,
      };
      jobs.push(job);
    }
    return this.rayTracingWorkerService.processData(jobs).pipe(
      map(({ data }) => {
        const startIndex = data.rowIndex * (4 * this.imageWidth);
        for (let i = 0; i < 4 * this.imageWidth; i += 1) {
          this.imgData.data[startIndex + i] = data.rowImgData[i];
        }
        return this.imgData;
      }),
    );
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
      .add(this.skyBoxColor.multiply(a));
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
