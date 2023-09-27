import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCanvasComponent } from './ng-canvas.component';

describe('NgCanvasComponent', () => {
  let component: NgCanvasComponent;
  let fixture: ComponentFixture<NgCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgCanvasComponent],
    });
    fixture = TestBed.createComponent(NgCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
