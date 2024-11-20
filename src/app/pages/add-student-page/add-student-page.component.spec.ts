import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStudentPageComponent } from './add-student-page.component';

describe('AddStudentPageComponent', () => {
  let component: AddStudentPageComponent;
  let fixture: ComponentFixture<AddStudentPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddStudentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddStudentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
