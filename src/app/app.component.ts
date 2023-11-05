import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IScene } from 'src/common/interfaces/scene.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  selectedScene!: IScene<Observable<ImageData>>;

  canvasImageData$!: Observable<ImageData>;

  handleSceneChange(scene: IScene<Observable<ImageData>>) {
    this.selectedScene = scene;
    this.canvasImageData$ = this.selectedScene
      .renderScene()
      .pipe(map((img) => structuredClone(img)));
  }

  handleSettingsChange(settings: any): void {
    this.selectedScene.setSceneSettings(settings);
    this.canvasImageData$ = this.selectedScene
      .renderScene()
      .pipe(map((img) => structuredClone(img)));
  }
}
