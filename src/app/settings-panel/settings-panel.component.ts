import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Vec3 } from 'src/common/classes/vec3';

interface RayTracingSettings {
  samplesPerPixel: number;
  maxDepth: number;
}
interface RayTracingSettingsForm {
  samplesPerPixel: FormControl<number>;
  maxDepth: FormControl<number>;
}

interface CameraSettings {
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

interface Settings {
  rayTracingSettings: RayTracingSettings;
  cameraSettings: CameraSettings;
}

interface SettingsForm {
  rayTracingSettings: FormGroup<RayTracingSettingsForm>;
  cameraSettings: FormGroup<CameraSettingsForm>;
}

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent implements OnInit {
  @Output() emitSettings = new EventEmitter<Settings>();

  mainForm: FormGroup = new FormGroup({});

  rayTracingSettingsForm!: FormGroup<RayTracingSettingsForm>;

  cameraSettingsForm!: FormGroup<CameraSettingsForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rayTracingSettingsForm = this.fb.group<RayTracingSettingsForm>({
      samplesPerPixel: this.fb.control<number>(50, { nonNullable: true }),
      maxDepth: this.fb.control<number>(15, { nonNullable: true }),
    });
    this.cameraSettingsForm = this.fb.group<CameraSettingsForm>({
      vFov: this.fb.control<number>(20, { nonNullable: true }),
      lookFromX: this.fb.control<number>(13, { nonNullable: true }),
      lookFromY: this.fb.control<number>(2, { nonNullable: true }),
      lookFromZ: this.fb.control<number>(3, { nonNullable: true }),
      lookAtX: this.fb.control<number>(0, { nonNullable: true }),
      lookAtY: this.fb.control<number>(0, { nonNullable: true }),
      lookAtZ: this.fb.control<number>(-1, { nonNullable: true }),
      defocusAngle: this.fb.control<number>(0, { nonNullable: true }),
      focusDistance: this.fb.control<number>(10, { nonNullable: true }),
    });
    this.mainForm = new FormGroup<SettingsForm>({
      rayTracingSettings: this.rayTracingSettingsForm,
      cameraSettings: this.cameraSettingsForm,
    });
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
      };
      this.emitSettings.emit(settings);
    }
  }
}
