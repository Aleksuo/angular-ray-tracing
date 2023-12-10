import { IMaterial } from 'src/common/interfaces/material.interface';
import { randomRange } from 'src/common/utilities/math.util';
import { RayTracingWorkerService } from 'src/common/services/ray-tracing-worker.service';
import { RayTracingCamera } from '../cameras/ray-tracing-camera';
import { Sphere } from '../geometry/sphere';
import { HittableList } from '../hittables/hittable-list';
import { Lambertian } from '../materials/lambertian';
import { Vec3 } from './vec3';
import { Metal } from '../materials/metal';
import { Dielectric } from '../materials/dielectric';
import { Marble } from '../materials/marble';
import { Scene } from './scene';

export class SceneFactory {
  world: any;

  static createScene(sceneType: 'default' | 'sphere-cube' | 'marble') {
    switch (sceneType) {
      case 'default':
        return SceneFactory.createDefaultScene();
      case 'sphere-cube':
        return SceneFactory.createSphereCubeScene();
      case 'marble':
        return SceneFactory.createMarbleScene();
      default:
        throw new Error(`Scene type '${sceneType}' is not supported.`);
    }
  }

  private static createDefaultScene() {
    const camera = new RayTracingCamera(new RayTracingWorkerService());
    const settings = {
      rayTracingSettings: {
        samplesPerPixel: 50,
        maxDepth: 15,
      },
      cameraSettings: {
        vFov: 20,
        lookFrom: new Vec3(13, 2, 3),
        lookAt: new Vec3(0, 0, -1),
        vUp: new Vec3(0, 1, 0),
        defocusAngle: 0,
        focusDistance: 10,
      },
      otherSettings: {
        skyBoxColor: new Vec3(0.5, 0.7, 1.0),
      },
    };

    const world = new HittableList();

    const materialGround = new Lambertian(new Vec3(0.5, 0.5, 0.5));
    world.add(new Sphere(new Vec3(0, -1000, 0), 1000, materialGround));

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
            world.add(new Sphere(center, 0.2, sphereMaterial));
          } else if (chooseMat < 0.95) {
            const albedo = Vec3.random(0.5, 1);
            const fuzz = randomRange(0, 0.5);
            sphereMaterial = new Metal(albedo, fuzz);
            world.add(new Sphere(center, 0.2, sphereMaterial));
          } else {
            sphereMaterial = new Dielectric(1.5);
            world.add(new Sphere(center, 0.2, sphereMaterial));
          }
        }
      }
    }

    const material1 = new Dielectric(1.5);
    world.add(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

    const material2 = new Lambertian(new Vec3(0.4, 0.2, 0.1));
    world.add(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

    const material3 = new Metal(new Vec3(0.7, 0.6, 0.5), 0.0);
    world.add(new Sphere(new Vec3(4, 1, 0), 1.0, material3));

    return new Scene(world, camera, settings);
  }

  private static createSphereCubeScene() {
    const camera = new RayTracingCamera(new RayTracingWorkerService());
    const settings = {
      rayTracingSettings: {
        samplesPerPixel: 100,
        maxDepth: 50,
      },
      cameraSettings: {
        vFov: 21,
        lookFrom: new Vec3(15, 10, 5),
        lookAt: new Vec3(0, 0, 0),
        vUp: new Vec3(0, 1, 0),
        defocusAngle: 0,
        focusDistance: 10,
      },
      otherSettings: {
        skyBoxColor: new Vec3(254 / 255, 247 / 255, 219 / 255),
      },
    };

    const world = new HittableList();
    const materialGround = new Lambertian(
      new Vec3(254 / 255, 247 / 255, 219 / 255),
    );
    world.add(new Sphere(new Vec3(0, -1000, -100), 1000, materialGround));

    for (let a = -2; a < 2; a += 1) {
      for (let b = -2; b < 2; b += 1) {
        for (let c = -2; c < 2; c += 1) {
          const center = new Vec3(a + 0.9, c + 0.9, b + 0.9);
          const albedo = Vec3.random().vectorMultiply(Vec3.random());
          const sphereMaterial = new Lambertian(albedo);
          world.add(new Sphere(center, 0.9, sphereMaterial));
        }
      }
    }
    return new Scene(world, camera, settings);
  }

  private static createMarbleScene() {
    const camera = new RayTracingCamera(new RayTracingWorkerService());
    const settings = {
      rayTracingSettings: {
        samplesPerPixel: 150,
        maxDepth: 15,
      },
      cameraSettings: {
        vFov: 10,
        lookFrom: new Vec3(10, 3, 35),
        lookAt: new Vec3(0, 1, 0),
        vUp: new Vec3(0, 1, 0),
        defocusAngle: 0,
        focusDistance: 10,
      },
      otherSettings: {
        skyBoxColor: new Vec3(254 / 255, 247 / 255, 219 / 255),
      },
    };

    const world = new HittableList();

    const materialGround = new Lambertian(
      new Vec3(254 / 255, 247 / 255, 219 / 255),
    );
    world.add(new Sphere(new Vec3(0, -1000, 0), 1000, materialGround));

    const material1 = new Marble(
      new Vec3(0.1, 0.1, 0.3),
      new Vec3(0.5, 0.6, 0.4),
      Math.random(),
    );
    world.add(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

    const material2 = new Marble(
      new Vec3(0.4, 0.2, 0.1),
      new Vec3(211 / 255, 211 / 255, 211 / 255),
      Math.random(),
    );
    world.add(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

    const material3 = new Marble(
      new Vec3(0.4, 0.4, 0.4),
      new Vec3(0.5, 0.6, 0.4),
      Math.random(),
    );
    world.add(new Sphere(new Vec3(4, 1, 0), 1.0, material3));

    return new Scene(world, camera, settings);
  }
}
