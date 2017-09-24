import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcdaViewerComponent } from './ccda-viewer.component';

describe('CcdaViewerComponent', () => {
  let component: CcdaViewerComponent;
  let fixture: ComponentFixture<CcdaViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcdaViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcdaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
