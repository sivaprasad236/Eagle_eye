import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditingComponent } from './image-editing.component';

describe('ImageEditingComponent', () => {
  let component: ImageEditingComponent;
  let fixture: ComponentFixture<ImageEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
