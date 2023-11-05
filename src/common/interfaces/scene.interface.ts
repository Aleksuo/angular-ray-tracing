import { ICamera } from './camera.interfce';
import { IHittable } from './hittable.interface';

export interface IScene<T> {
  camera: ICamera<T>;
  world: IHittable;
  readonly defaultSettings: any;
  setSceneSettings: (settings: any) => void;
  renderScene: () => T;
}
