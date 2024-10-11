import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropdownInputFieldMultiSelectComponent } from './dropdown-input-field-multi-select.component';

describe('DropdownInputFieldMultiSelectComponent', () => {
  let component: DropdownInputFieldMultiSelectComponent;
  let fixture: ComponentFixture<DropdownInputFieldMultiSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownInputFieldMultiSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownInputFieldMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
