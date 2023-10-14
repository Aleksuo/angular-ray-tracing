import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgCanvasComponent } from './ng-canvas/ng-canvas.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';

@NgModule({
  declarations: [AppComponent, NgCanvasComponent, SettingsPanelComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
