import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-checkbox',
  templateUrl: './auth-checkbox.component.html',
  styleUrls: ['./auth-checkbox.component.scss'],
})
export class AuthCheckboxComponent {
  @Input() text = '';
  @Input() link = '';
  @Input() linkText = '';
  @Input() errorMessage = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  public checkboxValue = false;


  public onCheckboxChange(): void {
    this.checkedChange.emit(this.checkboxValue);
  }

}
