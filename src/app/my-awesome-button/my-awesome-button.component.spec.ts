import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAwesomeButtonComponent } from './my-awesome-button.component';

describe('MyAwesomeButtonComponent', () => {
  let component: MyAwesomeButtonComponent;
  let fixture: ComponentFixture<MyAwesomeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAwesomeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAwesomeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
