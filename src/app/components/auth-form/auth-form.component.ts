import { Component, Input, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthInputFieldsComponent } from '../auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../auth-checkbox/auth-checkbox.component';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @ViewChild('nameField') nameField!: AuthInputFieldsComponent;
  @ViewChild('emailField') emailField!: AuthInputFieldsComponent;
  @ViewChild('passwordField') passwordField!: AuthInputFieldsComponent;
  @ViewChild('confirmPasswordField') confirmPasswordField!: AuthInputFieldsComponent;

  @ViewChild('privacyCheckbox') privacyCheckbox!: AuthCheckboxComponent;

  @Input() isLogin = false;
  public email = '';
  public password = '';
  public confirmPassword = '';
  public showPassword = false;
  public showConfirmPassword = false;



  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  public onSubmit(): void {
    if (!this.isLogin) {
      this.signUp();
      return
    }
    this.login();
  }

  private async signUp() {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField ? this.confirmPasswordField.getValue() : '';

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.privacyCheckbox.checkboxValue) {
      alert('You must accept the Privacy Policy.');
      return;
    }

    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } catch (error) {
      // alert('Error during registration: ' + error.message);
    }
  }

  private async login(): Promise<void> {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();

    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      alert('Login successful!');
      // Nach erfolgreichem Login weiterleiten
      this.router.navigate(['/home']);
    } catch (error) {
      // alert('Error during login: ' + error.message);
    }
  }


}

