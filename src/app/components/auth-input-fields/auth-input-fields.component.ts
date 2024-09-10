import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-input-fields',
  templateUrl: './auth-input-fields.component.html',
  styleUrls: ['./auth-input-fields.component.scss'],
})
export class AuthInputFieldsComponent implements OnInit {
  @Input() isLogin = false;
  @Input() type = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() isPasswordField = false;

  @Input() errorMessage = '';

  public showPassword = false;
  public inputValue = '';
  constructor() { }

  ngOnInit() { }

  getValue(): string {
    return this.inputValue;
  }

  setValue(value: string): void {
    this.inputValue = value;
  }

}
