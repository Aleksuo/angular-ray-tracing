import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { HittableList } from 'src/common/classes/hittable-list';
import { Sphere } from 'src/common/classes/sphere';
import { Vec3 } from 'src/common/classes/vec3';
import { RayTracingCamera } from 'src/common/classes/ray-tracing-camera';
import { ICamera } from 'src/common/interfaces/camera.interfce';
import { Lambertian } from 'src/common/classes/lambertian';
import { Metal } from 'src/common/classes/metal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('canvasElement', { static: false })
  canvasElement: ElementRef<HTMLCanvasElement> =
    {} as ElementRef<HTMLCanvasElement>;

  context: CanvasRenderingContext2D | null = null;

  camera!: ICamera<ImageData>;

  world!: HittableList;

  ngOnInit(): void {
    this.camera = new RayTracingCamera();
    this.camera.aspectRatio = 16.0 / 9.0;
    this.camera.imageWidth = 800;
    this.camera.samplesPerPixel = 10;

    this.camera.initialize();

    this.world = new HittableList();

    const materialGround = new Lambertian(new Vec3(0.8, 0.8, 0.0));
    const materialCenter = new Lambertian(new Vec3(0.7, 0.3, 0.3));
    const materialLeft = new Metal(new Vec3(0.8, 0.8, 0.8), 0.3);
    const materialRight = new Metal(new Vec3(0.8, 0.6, 0.2), 1.0);

    this.world.add(new Sphere(new Vec3(0, 0, -1), 0.5, materialCenter));
    this.world.add(new Sphere(new Vec3(0, -100.5, -1), 100, materialGround));
    this.world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, materialLeft));
    this.world.add(new Sphere(new Vec3(1, 0, -1), 0.5, materialRight));
  }

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    if (this.context) {
      this.context.canvas.width = this.camera.imageWidth;
      this.context.canvas.height = this.camera.imageHeight;

      this.context.putImageData(this.camera.render(this.world), 0, 0);
    }
  }
}
