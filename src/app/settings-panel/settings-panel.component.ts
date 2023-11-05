import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Scene } from 'src/common/classes/utilities/scene';
import { SceneFactory } from 'src/common/classes/utilities/scene-factory';
import { Vec3 } from 'src/common/classes/utilities/vec3';

export interface RayTracingSettings {
  samplesPerPixel: number;
  maxDepth: number;
}
interface RayTracingSettingsForm {
  samplesPerPixel: FormControl<number>;
  maxDepth: FormControl<number>;
}

export interface CameraSettings {
  vFov: number;
  lookFrom: Vec3;
  lookAt: Vec3;
  defocusAngle: number;
  focusDistance: number;
}

interface CameraSettingsForm {
  vFov: FormControl<number>;
  lookFromX: FormControl<number>;
  lookFromY: FormControl<number>;
  lookFromZ: FormControl<number>;
  lookAtX: FormControl<number>;
  lookAtY: FormControl<number>;
  lookAtZ: FormControl<number>;
  defocusAngle: FormControl<number>;
  focusDistance: FormControl<number>;
}

export interface OtherSettings {
  skyBoxColor: Vec3;
}

interface OtherSettingsForm {
  skyBoxColorR: FormControl<number>;
  skyBoxColorG: FormControl<number>;
  skyBoxColorB: FormControl<number>;
}
export interface Settings {
  rayTracingSettings: RayTracingSettings;
  cameraSettings: CameraSettings;
  otherSettings: OtherSettings;
}

interface SettingsForm {
  rayTracingSettings: FormGroup<RayTracingSettingsForm>;
  cameraSettings: FormGroup<CameraSettingsForm>;
  otherSettingsForm: FormGroup<OtherSettingsForm>;
}

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent implements OnInit {
  @Output() emitSettings = new EventEmitter<Settings>();

  @Output() emitScene = new EventEmitter<Scene>();

  selectedScene: FormControl<'default' | 'glass-sphere-cube'> = new FormControl(
    'default',
    { nonNullable: true },
  );

  mainForm: FormGroup = new FormGroup({});

  rayTracingSettingsForm!: FormGroup<RayTracingSettingsForm>;

  cameraSettingsForm!: FormGroup<CameraSettingsForm>;

  otherSettingsForm!: FormGroup<OtherSettingsForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const scene = SceneFactory.createScene(this.selectedScene.value);
    this.initializeFormFromSceneDefaultSettings(scene.defaultSettings);
    this.emitScene.emit(scene);
    this.selectedScene.valueChanges.subscribe((sceneType) =>
      this.changeScene(sceneType),
    );
  }

  initializeFormFromSceneDefaultSettings(settings: Settings): void {
    const { rayTracingSettings, cameraSettings, otherSettings } = settings;
    this.rayTracingSettingsForm = this.fb.group<RayTracingSettingsForm>({
      samplesPerPixel: this.fb.control<number>(
        rayTracingSettings.samplesPerPixel,
        { nonNullable: true },
      ),
      maxDepth: this.fb.control<number>(rayTracingSettings.maxDepth, {
        nonNullable: true,
      }),
    });
    this.cameraSettingsForm = this.fb.group<CameraSettingsForm>({
      vFov: this.fb.control<number>(cameraSettings.vFov, { nonNullable: true }),
      lookFromX: this.fb.control<number>(cameraSettings.lookFrom.x, {
        nonNullable: true,
      }),
      lookFromY: this.fb.control<number>(cameraSettings.lookFrom.y, {
        nonNullable: true,
      }),
      lookFromZ: this.fb.control<number>(cameraSettings.lookFrom.z, {
        nonNullable: true,
      }),
      lookAtX: this.fb.control<number>(cameraSettings.lookAt.x, {
        nonNullable: true,
      }),
      lookAtY: this.fb.control<number>(cameraSettings.lookAt.y, {
        nonNullable: true,
      }),
      lookAtZ: this.fb.control<number>(cameraSettings.lookAt.z, {
        nonNullable: true,
      }),
      defocusAngle: this.fb.control<number>(cameraSettings.defocusAngle, {
        nonNullable: true,
      }),
      focusDistance: this.fb.control<number>(cameraSettings.focusDistance, {
        nonNullable: true,
      }),
    });
    this.otherSettingsForm = this.fb.group<OtherSettingsForm>({
      skyBoxColorR: this.fb.control<number>(otherSettings.skyBoxColor.x, {
        nonNullable: true,
      }),
      skyBoxColorG: this.fb.control<number>(otherSettings.skyBoxColor.y, {
        nonNullable: true,
      }),
      skyBoxColorB: this.fb.control<number>(otherSettings.skyBoxColor.z, {
        nonNullable: true,
      }),
    });
    this.mainForm = new FormGroup<SettingsForm>({
      rayTracingSettings: this.rayTracingSettingsForm,
      cameraSettings: this.cameraSettingsForm,
      otherSettingsForm: this.otherSettingsForm,
    });
  }

  changeScene(scene: 'default' | 'glass-sphere-cube'): void {
    const newScene = SceneFactory.createScene(scene);
    this.initializeFormFromSceneDefaultSettings(newScene.defaultSettings);
    this.emitScene.emit(newScene);
    this.emitSettings.emit(newScene.defaultSettings);
  }

  resetSettings(): void {
    this.mainForm.reset();
    const defaultSettings: Settings = {
      rayTracingSettings: this.rayTracingSettingsForm
        .value as RayTracingSettings,
      cameraSettings: {
        vFov: this.cameraSettingsForm.controls.vFov.value,
        lookFrom: new Vec3(
          this.cameraSettingsForm.controls.lookFromX.value,
          this.cameraSettingsForm.controls.lookFromY.value,
          this.cameraSettingsForm.controls.lookFromZ.value,
        ),
        lookAt: new Vec3(
          this.cameraSettingsForm.controls.lookAtX.value,
          this.cameraSettingsForm.controls.lookAtY.value,
          this.cameraSettingsForm.controls.lookAtZ.value,
        ),
        defocusAngle: this.cameraSettingsForm.controls.defocusAngle.value,
        focusDistance: this.cameraSettingsForm.controls.focusDistance.value,
      },
      otherSettings: {
        skyBoxColor: new Vec3(
          this.otherSettingsForm.controls.skyBoxColorR.value,
          this.otherSettingsForm.controls.skyBoxColorG.value,
          this.otherSettingsForm.controls.skyBoxColorB.value,
        ),
      },
    };
    this.emitSettings.emit(defaultSettings);
  }

  applySettings(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.valid) {
      const settings: Settings = {
        rayTracingSettings: this.rayTracingSettingsForm
          .value as RayTracingSettings,
        cameraSettings: {
          vFov: this.cameraSettingsForm.controls.vFov.value,
          lookFrom: new Vec3(
            this.cameraSettingsForm.controls.lookFromX.value,
            this.cameraSettingsForm.controls.lookFromY.value,
            this.cameraSettingsForm.controls.lookFromZ.value,
          ),
          lookAt: new Vec3(
            this.cameraSettingsForm.controls.lookAtX.value,
            this.cameraSettingsForm.controls.lookAtY.value,
            this.cameraSettingsForm.controls.lookAtZ.value,
          ),
          defocusAngle: this.cameraSettingsForm.controls.defocusAngle.value,
          focusDistance: this.cameraSettingsForm.controls.focusDistance.value,
        },
        otherSettings: {
          skyBoxColor: new Vec3(
            this.otherSettingsForm.controls.skyBoxColorR.value,
            this.otherSettingsForm.controls.skyBoxColorG.value,
            this.otherSettingsForm.controls.skyBoxColorB.value,
          ),
        },
      };
      this.emitSettings.emit(settings);
    }
  }
}
