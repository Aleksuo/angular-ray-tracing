import { Observable } from 'rxjs';
import { Settings } from 'src/app/settings-panel/settings-panel.component';
import { ICamera } from 'src/common/interfaces/camera.interfce';
import { IHittable } from 'src/common/interfaces/hittable.interface';
import { IScene } from 'src/common/interfaces/scene.interface';

export class Scene implements IScene<Observable<ImageData>> {
  camera: ICamera<Observable<ImageData>>;

  world: IHittable;

  readonly defaultSettings!: Settings;

  constructor(
    world: IHittable,
    camera: ICamera<Observable<ImageData>>,
    defaultSettings: Settings,
  ) {
    this.world = world;
    this.defaultSettings = defaultSettings;
    this.camera = camera;
    this.camera.setCameraSettings(this.defaultSettings);
    this.camera.initialize();
  }

  setSceneSettings(settings: any) {
    this.camera.setCameraSettings(settings);
  }

  renderScene(): Observable<ImageData> {
    return this.camera.render(this.world);
  }
}
