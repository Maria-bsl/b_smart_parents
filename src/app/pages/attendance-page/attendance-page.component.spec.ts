import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendancePageComponent } from './attendance-page.component';

describe('AttendancePageComponent', () => {
  let component: AttendancePageComponent;
  let fixture: ComponentFixture<AttendancePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AttendancePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
