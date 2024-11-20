import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetSupportPageComponent } from './get-support-page.component';

describe('GetSupportPageComponent', () => {
  let component: GetSupportPageComponent;
  let fixture: ComponentFixture<GetSupportPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GetSupportPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GetSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
