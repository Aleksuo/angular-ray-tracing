import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvasElement', { static: false })
  canvasElement: ElementRef<HTMLCanvasElement> =
    {} as ElementRef<HTMLCanvasElement>;

  context: CanvasRenderingContext2D | null = null;

  image_width = 256;

  image_height = 256;

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    if (this.context) {
      this.context.canvas.width = this.image_width;
      this.context.canvas.height = this.image_height;

      const imgData = new ImageData(this.image_width, this.image_height);
      for (let i = 0; i < this.image_height; i += 1) {
        for (let j = 0; j < this.image_width; j += 1) {
          const index = (i * this.image_width + j) * 4;
          imgData.data[index] = 255;
          imgData.data[index + 1] = 0;
          imgData.data[index + 2] = 0;
          imgData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(imgData, 0, 0);
    }
  }
}
