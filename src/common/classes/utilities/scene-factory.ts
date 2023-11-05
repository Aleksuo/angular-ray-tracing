import { IMaterial } from 'src/common/interfaces/material.interface';
import { randomRange } from 'src/common/utilities/math.util';
import { RayTracingCamera } from '../cameras/ray-tracing-camera';
import { Sphere } from '../geometry/sphere';
import { HittableList } from '../hittables/hittable-list';
import { Lambertian } from '../materials/lambertian';
import { Vec3 } from './vec3';
import { Metal } from '../materials/metal';
import { Dielectric } from '../materials/dielectric';
import { Scene } from './scene';

export class SceneFactory {
  world: any;

  static createScene(sceneType: 'default' | 'glass-sphere-cube') {
    switch (sceneType) {
      case 'default':
        return SceneFactory.createDefaultScene();
      case 'glass-sphere-cube':
        return SceneFactory.createGlassSphereCubeScene();
      default:
        throw new Error(`Scene type '${sceneType}' is not supported.`);
    }
  }

  private static createDefaultScene() {
    const camera = new RayTracingCamera();
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

  private static createGlassSphereCubeScene() {
    const camera = new RayTracingCamera();
    const settings = {
      rayTracingSettings: {
        samplesPerPixel: 50,
        maxDepth: 150,
      },
      cameraSettings: {
        vFov: 20,
        lookFrom: new Vec3(15, 10, 5),
        lookAt: new Vec3(0, 0, 0),
        vUp: new Vec3(0, 1, 0),
        defocusAngle: 0,
        focusDistance: 10,
      },
      otherSettings: {
        skyBoxColor: new Vec3(0.2, 1.0, 0.2),
      },
    };

    const world = new HittableList();

    for (let a = -2; a < 2; a += 1) {
      for (let b = -2; b < 2; b += 1) {
        for (let c = -2; c < 2; c += 1) {
          const center = new Vec3(a + 0.9, c + 0.9, b + 0.9);
          if (a === 0 && b === 0 && c === 0) {
            const sphereMaterial = new Lambertian(new Vec3(1.0, 0.0, 0.0));
            world.add(new Sphere(center, 0.9, sphereMaterial));
          } else {
            const sphereMaterial = new Dielectric(1.5);
            world.add(new Sphere(center, 0.9, sphereMaterial));
          }
        }
      }
    }
    return new Scene(world, camera, settings);
  }
}
