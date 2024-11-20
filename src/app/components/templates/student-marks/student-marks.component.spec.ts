import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentMarksComponent } from './student-marks.component';

describe('StudentMarksComponent', () => {
  let component: StudentMarksComponent;
  let fixture: ComponentFixture<StudentMarksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StudentMarksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
