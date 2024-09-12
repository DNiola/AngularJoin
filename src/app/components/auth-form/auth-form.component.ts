import { Component, Input, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthInputFieldsComponent } from '../auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../auth-checkbox/auth-checkbox.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

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
  @ViewChild('rememberMeCheckbox') rememberMeCheckbox!: AuthCheckboxComponent;

  @Input() isLogin = false;

  public showPassword = false;
  public showConfirmPassword = false;
  public errorMessage = '';

  private isError = false;
  public isAnimation = false;


  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private userService: UserService) { }

  ngAfterViewInit() {
    const savedEmail = localStorage.getItem('email');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && this.emailField) {
      this.emailField.setValue(savedEmail);
      this.rememberMeCheckbox.checkboxValue = rememberMe;
    }
  }


  public onSubmit(): void {
    if (!this.isLogin) {
      this.getSignUpData();
    } else {
      this.getLoginData();
    }
  }


  private getSignUpData(): void {
    const name = this.nameField.getValue();
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField ? this.confirmPasswordField.getValue() : '';
    const checkbox = this.privacyCheckbox.checkboxValue;

    this.checkValueInputFields(name, email, password, confirmPassword, checkbox);
    if (this.isError) {
      this.isError = false;
    } else {
      this.signUp(name, email, password);
    }
  }


  private async signUp(name: string, email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const userID = result.user?.uid;

      const initials = this.getInitials(name);
      const color = this.getRandomColor();

      await this.saveUserToFirestore(userID, name, email, initials, color);

      this.isAnimation = true;
      setTimeout(() => {
        this.EmptyInputFields();
        this.router.navigate(['/login']);
      }, 1000);
    }
    catch (error) {
      this.handleErrorFromFirebase(error);
      return;
    }
  }


  private async getLoginData() {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const rememberMe = this.rememberMeCheckbox.checkboxValue;

    this.persistenceRememberMe(rememberMe, email)
    this.checkLoginInputFields(email, password);
    if (this.isError) {
      this.isError = false;
    } else {
      await this.login(email, password);
    }
  }


  private async login(email: string, password: string) {
    try {

      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = result.user;


      const userDataSnapshot = await this.firestore.collection('users').doc(user?.uid).get().toPromise();
      const userData = userDataSnapshot?.data() as User;

      this.userService.setUser({
        userId: user?.uid || '',
        name: userData.name || '',
        email: user?.email || '',
        initials: userData.initials,
        color: userData.color
      });

      this.router.navigate(['/summary']);
    } catch (error) {
      this.handleErrorFromFirebase(error);
    }
  }

  // Set the persistence based on the "Remember Me" option
  private async persistenceRememberMe(rememberMe: boolean, email: string) {
    await this.afAuth.setPersistence(rememberMe ? 'local' : 'session');

    if (rememberMe) {
      localStorage.setItem('email', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('rememberMe');
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


  private handleErrorFromFirebase(error: any): void {
    if (error.code === 'auth/email-already-in-use') {
      this.emailField.errorMessage = 'This email is already in use. Please try again.';
    }

    if (error.code === 'auth/invalid-email') {
      this.emailField.errorMessage = 'This email is invalid. Please try again.';
    }

    if (error.code === 'auth/invalid-credential') {
      this.passwordField.errorMessage = 'Check your email and password. Please try again.';
      this.emailField.errorMessage = 'Check your email and password. Please try again.';
    }

    if (this.errorMessage) {
      this.errorMessage = 'An unknown error occurred. Please try again.';
    }
  }


  private checkLoginInputFields(email: string, password: string) {
    this.isError = false;

    if (!this.validateField(this.emailField, email, { required: true })) this.isError = true;
    if (!this.validateField(this.passwordField, password, { required: true })) this.isError = true;
  }


  public EmptyInputFields(): void {
    this.nameField.inputValue = '';
    this.emailField.inputValue = '';
    this.passwordField.inputValue = '';
    this.confirmPasswordField.inputValue = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.privacyCheckbox.checkboxValue = false;
    this.isAnimation = false;
  }



  private getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names[0][0] + (names[1] ? names[1][0] : '');
    return initials.toUpperCase();
  }


  private getRandomColor(): string {
    const colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  private saveUserToFirestore(userID: string | undefined, name: string, email: string, initials: string, color: string): Promise<void> {
    return this.firestore.collection('users').doc(userID).set({
      userID: userID,
      name: name,
      email: email,
      initials: initials,
      color: color
    });
  }


  public EmptyErrorField(fieldName: AuthInputFieldsComponent | AuthCheckboxComponent): void {
    fieldName.errorMessage = '';
  }

}

