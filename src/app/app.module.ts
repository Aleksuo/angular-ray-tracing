import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgCanvasComponent } from './ng-canvas/ng-canvas.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';

@NgModule({
  declarations: [AppComponent, NgCanvasComponent, SettingsPanelComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
