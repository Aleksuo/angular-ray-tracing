import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-ng-canvas',
  templateUrl: './ng-canvas.component.html',
  styleUrls: ['./ng-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgCanvasComponent implements AfterViewInit {
  @ViewChild('canvasElement', { static: false })
  canvasElement: ElementRef<HTMLCanvasElement> =
    {} as ElementRef<HTMLCanvasElement>;

  @Input()
  set canvasImageData(imageData: ImageData | null) {
    this._canvasImageData = imageData;
    this.setCanvasImageData(this._canvasImageData);
  }

  _canvasImageData: ImageData | null = {} as ImageData;

  context: CanvasRenderingContext2D | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
  }

  setCanvasImageData(canvasImageData: ImageData | null): void {
    if (this.context && canvasImageData) {
      this.context.canvas.width = canvasImageData.width;
      this.context.canvas.height = canvasImageData.height;
      this.context.putImageData(canvasImageData, 0, 0);
      this.changeDetectorRef.markForCheck();
    }
  }
}
