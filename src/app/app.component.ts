import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { HittableList } from 'src/common/classes/hittable-list';
import { Ray } from 'src/common/classes/ray';
import { Sphere } from 'src/common/classes/sphere';
import { Vec3 } from 'src/common/classes/vec3';
import { IHitRecord } from 'src/common/interfaces/hit-record.interface';
import { Color, Point3 } from 'src/common/types/vec3.types';
import { HitRecord } from 'src/common/classes/hit-record';
import { Interval } from 'src/common/classes/interval';

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

  aspect_ratio!: number;

  image_width!: number;

  image_height!: number;

  viewport_height!: number;

  viewport_u!: Vec3;

  pixel_delta_u!: Vec3;

  viewport_width!: number;

  viewport_v!: Vec3;

  pixel_delta_v!: Vec3;

  focal_length!: number;

  camera_center!: Point3;

  viewport_upper_left!: Point3;

  pixel00_location!: Point3;

  imgData!: ImageData;

  world!: HittableList;

  ngOnInit(): void {
    this.aspect_ratio = 16.0 / 9.0;
    this.image_width = 800;

    this.image_height = Math.floor(this.image_width / this.aspect_ratio);
    this.image_height = this.image_height < 1 ? 1 : this.image_height;

    this.focal_length = 1.0;
    this.viewport_height = 2.0;
    this.viewport_width =
      this.viewport_height * (Math.floor(this.image_width) / this.image_height);
    this.camera_center = new Vec3(0, 0, 0);

    this.viewport_u = new Vec3(this.viewport_width, 0, 0);
    this.viewport_v = new Vec3(0, -this.viewport_height, 0);

    this.pixel_delta_u = this.viewport_u.divide(this.image_width);
    this.pixel_delta_v = this.viewport_v.divide(this.image_height);

    this.viewport_upper_left = this.camera_center
      .subtract(this.viewport_u.divide(2))
      .subtract(this.viewport_v.divide(2))
      .subtract(new Vec3(0, 0, this.focal_length));

    this.pixel00_location = this.pixel_delta_u
      .add(this.pixel_delta_v)
      .multiply(0.5)
      .add(this.viewport_upper_left);

    this.world = new HittableList();
    this.world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
    this.world.add(new Sphere(new Vec3(0, -100.5, -1), 100));
  }

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    if (this.context) {
      this.context.canvas.width = this.image_width;
      this.context.canvas.height = this.image_height;

      this.imgData = new ImageData(this.image_width, this.image_height);
      for (let j = 0; j < this.image_height; j += 1) {
        for (let i = 0; i < this.image_width; i += 1) {
          const pixelCenter = this.pixel00_location
            .add(this.pixel_delta_u.multiply(i))
            .add(this.pixel_delta_v.multiply(j));
          const rayDirection = pixelCenter.subtract(this.camera_center);
          const index = (j * this.image_width + i) * 4;

          const r = new Ray(this.camera_center, rayDirection);
          const pixelColor = this.rayColor(r, this.world);

          this.drawPixel(index, pixelColor);
        }
      }
      this.context.putImageData(this.imgData, 0, 0);
    }
  }

  drawPixel(index: number, color: Vec3): void {
    this.imgData.data[index] = color.x;
    this.imgData.data[index + 1] = color.y;
    this.imgData.data[index + 2] = color.z;
    this.imgData.data[index + 3] = 255;
  }

  // eslint-disable-next-line class-methods-use-this
  rayColor(ray: Ray, world: HittableList): Color {
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
}
