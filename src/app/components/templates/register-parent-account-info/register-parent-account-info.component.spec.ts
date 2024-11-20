import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterParentAccountInfoComponent } from './register-parent-account-info.component';

describe('RegisterParentAccountInfoComponent', () => {
  let component: RegisterParentAccountInfoComponent;
  let fixture: ComponentFixture<RegisterParentAccountInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterParentAccountInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterParentAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
