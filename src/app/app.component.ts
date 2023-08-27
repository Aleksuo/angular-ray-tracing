import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvasElement', {static: false}) canvasElement: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;

  context: CanvasRenderingContext2D | null = null;

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    if(this.context) {
      this.context.fillStyle = 'green';
      this.context.fillRect(0, 0, 100, 100);
    }
  }
}
