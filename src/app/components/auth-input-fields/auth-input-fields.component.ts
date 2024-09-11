import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-input-fields',
  templateUrl: './auth-input-fields.component.html',
  styleUrls: ['./auth-input-fields.component.scss'],
})
export class AuthInputFieldsComponent {
  @Input() isLogin = false;
  @Input() type = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() isPasswordField = false;

  @Input() errorMessage = '';

  public showPassword = false;
  public inputValue = '';

  getValue(): string {
    return this.inputValue;
  }

  setValue(value: string): void {
    this.inputValue = value;
  }

}
