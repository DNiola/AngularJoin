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

  public showPassword = false;
  public showConfirmPassword = false;
  public errorMessage = '';

  private isError = false;


  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  public onSubmit(): void {
    if (!this.isLogin) {
      this.getSignUpData();
    } else {
      this.login();
    }
  }


  private async getSignUpData(): Promise<void> {
    const name = this.nameField.getValue();
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField ? this.confirmPasswordField.getValue() : '';
    const checkbox = this.privacyCheckbox.checkboxValue;

    this.checkValueInputFields(name, email, password, confirmPassword, checkbox);
    if (this.isError) {
      this.isError = false;
    } else {
      this.signUp(email, password);
    }
  }


  private checkValueInputFields(name: string, email: string, password: string, confirmPassword: string, checkbox: boolean): void {
    this.isError = false;

    if (!this.validateField(this.nameField, name, { required: true })) this.isError = true;
    if (!this.validateField(this.emailField, email, { required: true })) this.isError = true;
    if (!this.validateField(this.passwordField, password, { required: true, minLength: 6 })) this.isError = true;
    if (!this.validateField(this.confirmPasswordField, confirmPassword, { required: true, minLength: 6 })) this.isError = true;

    if (password !== confirmPassword) {
      this.passwordField.errorMessage = "Your passwords don't match. Please try again.";
      this.confirmPasswordField.errorMessage = "Your passwords don't match. Please try again.";
      this.isError = true;
    }

    if (!checkbox) {
      this.privacyCheckbox.errorMessage = 'You must accept the Privacy Policy.';
      this.isError = true;
    }
  }


  private validateField(field: AuthInputFieldsComponent, value: string, rules: { required?: boolean, minLength?: number }): boolean {
    field.errorMessage = '';

    if (rules.required && !value) {
      field.errorMessage = 'This field is required.';
      return false;
    }

    if (rules.minLength && value.length < rules.minLength) {
      field.errorMessage = `This field needs at least ${rules.minLength} characters.`;
      return false;
    }

    return true;
  }


  private async signUp(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      alert('Registration successful!');
      this.EmptyInputFields();
      this.router.navigate(['/login']);
    }
    catch (error) {
      this.handleSignUpError(error);
      return;
    }
  }


  private handleSignUpError(error: any): void {
    if (error.code === 'auth/email-already-in-use') {
      this.emailField.errorMessage = 'This email is already in use. Please try again.';
    }

    if (error.code === 'auth/invalid-email') {
      this.emailField.errorMessage = 'This email is invalid. Please try again.';
    }

    if (this.errorMessage) {
      this.errorMessage = 'An unknown error occurred. Please try again.';
    }
  }


  private async login(): Promise<void> {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();

    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      alert('Login successful!');
      this.router.navigate(['/home']);
    } catch (error) {
    }
  }


  public EmptyInputFields(): void {
    this.nameField.inputValue = '';
    this.emailField.inputValue = '';
    this.passwordField.inputValue = '';
    this.confirmPasswordField.inputValue = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.privacyCheckbox.checkboxValue = false;
  }


  public EmptyErrorField(fieldName: AuthInputFieldsComponent | AuthCheckboxComponent): void {
    fieldName.errorMessage = '';
  }

}

