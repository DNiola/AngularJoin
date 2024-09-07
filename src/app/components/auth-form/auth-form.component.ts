import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @Input() isLogin = true;
  public email = '';
  public password = '';
  public confirmPassword = '';
  public showPassword = false;

 

  onSubmit() {
    if (this.isLogin) {
      // Login Logik
    } else {
      // Sign-Up Logik
    }
  }
}
