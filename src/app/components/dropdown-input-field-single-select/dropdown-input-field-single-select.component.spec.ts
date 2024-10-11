import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropdownInputFieldSingleSelectComponent } from './dropdown-input-field-single-select.component';

describe('DropdownInputFieldSingleSelectComponent', () => {
  let component: DropdownInputFieldSingleSelectComponent;
  let fixture: ComponentFixture<DropdownInputFieldSingleSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownInputFieldSingleSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownInputFieldSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
