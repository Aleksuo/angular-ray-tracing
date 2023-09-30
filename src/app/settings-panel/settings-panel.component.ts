import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.form = new FormGroup({
      // aspectRatio: new FormControl(16.0 / 9.0),
      // imageWidth: new FormControl(1200),
      samplesPerPixel: new FormControl(50),
      maxDepth: new FormControl(15),
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
}
