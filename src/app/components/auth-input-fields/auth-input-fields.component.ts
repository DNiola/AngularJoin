import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-input-fields',
  templateUrl: './auth-input-fields.component.html',
  styleUrls: ['./auth-input-fields.component.scss'],
})
export class AuthInputFieldsComponent implements OnInit {
  @Input() isLogin = false;
  @Input() type = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() icon = '';
  @Input() isPasswordField = false;

  public showPassword = false;
  public inputValue = '';
  constructor() { }

  ngOnInit() { }

}
