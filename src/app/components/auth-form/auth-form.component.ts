import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @Input() isLogin = false;
  public email = '';
  public password = '';
  public confirmPassword = '';
  public showPassword = false;
  public showConfirmPassword = false;
  public isSingUp = false;



  onSubmit() {
    if (this.isLogin) {
      this.isLogin = true;
    } else {
      console.log(this.isSingUp);
      this.isSingUp = true;
      console.log(this.isSingUp);
    }
  }
}
