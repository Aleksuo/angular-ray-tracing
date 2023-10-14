import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HittableList } from 'src/common/classes/hittables/hittable-list';
import { Sphere } from 'src/common/classes/geometry/sphere';
import { Vec3 } from 'src/common/classes/utilities/vec3';
import { RayTracingCamera } from 'src/common/classes/cameras/ray-tracing-camera';
import { Lambertian } from 'src/common/classes/materials/lambertian';
import { Metal } from 'src/common/classes/materials/metal';
import { Dielectric } from 'src/common/classes/materials/dielectric';
import { IMaterial } from 'src/common/interfaces/material.interface';
import { randomRange } from 'src/common/utilities/math.util';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  camera!: RayTracingCamera;

  world!: HittableList;

  canvasImageData$!: Observable<ImageData>;

  ngOnInit(): void {
    this.camera = new RayTracingCamera();
    this.camera.aspectRatio = 16.0 / 9.0;
    this.camera.imageWidth = 1200;
    this.camera.samplesPerPixel = 50;
    this.camera.maxDepth = 15;

    this.camera.vFov = 20;
    this.camera.lookFrom = new Vec3(13, 2, 3);
    this.camera.lookAt = new Vec3(0, 0, -1);
    this.camera.vUp = new Vec3(0, 1, 0);

    this.camera.defocusAngle = 0;
    this.camera.focusDistance = 10;

    this.camera.initialize();

    this.world = new HittableList();

    const materialGround = new Lambertian(new Vec3(0.5, 0.5, 0.5));
    this.world.add(new Sphere(new Vec3(0, -1000, 0), 1000, materialGround));

    for (let a = -11; a < 11; a += 1) {
      for (let b = -11; b < 11; b += 1) {
        const chooseMat = Math.random();
        const center = new Vec3(
          a + 0.9 * Math.random(),
          0.2,
          b + 0.9 * Math.random(),
        );

        if (center.subtract(new Vec3(4, 0.2, 0)).length() > 0.9) {
          let sphereMaterial: IMaterial;
          if (chooseMat < 0.8) {
            const albedo = Vec3.random().vectorMultiply(Vec3.random());
            sphereMaterial = new Lambertian(albedo);
            this.world.add(new Sphere(center, 0.2, sphereMaterial));
          } else if (chooseMat < 0.95) {
            const albedo = Vec3.random(0.5, 1);
            const fuzz = randomRange(0, 0.5);
            sphereMaterial = new Metal(albedo, fuzz);
            this.world.add(new Sphere(center, 0.2, sphereMaterial));
          } else {
            sphereMaterial = new Dielectric(1.5);
            this.world.add(new Sphere(center, 0.2, sphereMaterial));
          }
        }
      }
    }

    const material1 = new Dielectric(1.5);
    this.world.add(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

    const material2 = new Lambertian(new Vec3(0.4, 0.2, 0.1));
    this.world.add(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

    const material3 = new Metal(new Vec3(0.7, 0.6, 0.5), 0.0);
    this.world.add(new Sphere(new Vec3(4, 1, 0), 1.0, material3));

    this.canvasImageData$ = this.camera
      .render(this.world)
      .pipe(map((img) => structuredClone(img))); // copy because of change detection
  }

  handleSettingsChange(settings: any): void {
    this.camera.setSettings(settings);
    this.canvasImageData$ = this.camera
      .render(this.world)
      .pipe(map((img) => structuredClone(img)));
  }
}
