import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface RayTracingSettings {
  samplesPerPixel: number;
  maxDepth: number;
}
interface RayTracingSettingsForm {
  samplesPerPixel: FormControl<number>;
  maxDepth: FormControl<number>;
}

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent implements OnInit {
  @Output() emitSettings = new EventEmitter<RayTracingSettings>();

  mainForm: FormGroup = new FormGroup({});

  rayTracingSettingsForm!: FormGroup<RayTracingSettingsForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rayTracingSettingsForm = this.fb.group<RayTracingSettingsForm>({
      samplesPerPixel: this.fb.control<number>(50, { nonNullable: true }),
      maxDepth: this.fb.control<number>(15, { nonNullable: true }),
    });
    this.mainForm = new FormGroup<any>({
      rayTracingSettings: this.rayTracingSettingsForm,
      vFov: new FormControl(20),
      lookFromX: new FormControl(13),
      lookFromY: new FormControl(2),
      lookFromZ: new FormControl(3),
      lookAtX: new FormControl(0),
      lookAtY: new FormControl(0),
      lookAtZ: new FormControl(-1),
      vUpX: new FormControl(0),
      vUpY: new FormControl(1),
      vUpZ: new FormControl(0),
      defocusAngle: new FormControl(0),
      focusDistance: new FormControl(10),
    });
  }

  resetSettings(): void {
    this.rayTracingSettingsForm.reset();
    this.emitSettings.emit(
      this.rayTracingSettingsForm.value as RayTracingSettings,
    );
  }

  applySettings(): void {
    this.rayTracingSettingsForm.markAllAsTouched();
    if (this.rayTracingSettingsForm.valid) {
      this.emitSettings.emit(
        this.rayTracingSettingsForm.value as RayTracingSettings,
      );
    }
  }
}
