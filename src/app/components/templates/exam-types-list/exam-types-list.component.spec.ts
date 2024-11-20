import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExamTypesListComponent } from './exam-types-list.component';

describe('ExamTypesListComponent', () => {
  let component: ExamTypesListComponent;
  let fixture: ComponentFixture<ExamTypesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExamTypesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
