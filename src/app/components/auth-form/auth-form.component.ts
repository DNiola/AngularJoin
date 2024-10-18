import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthInputFieldsComponent } from '../auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../auth-checkbox/auth-checkbox.component';
import { UserService } from 'src/app/services/user.service';
import { AuthData } from 'src/app/models/user.model';
import { HelperService } from 'src/app/services/helper.service';
import { BadgeMessage } from 'src/app/models/badge-messages.model';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @ViewChild('nameField') public nameField!: AuthInputFieldsComponent;
  @ViewChild('emailField') public emailField!: AuthInputFieldsComponent;
  @ViewChild('passwordField') public passwordField!: AuthInputFieldsComponent;
  @ViewChild('confirmPasswordField') public confirmPasswordField!: AuthInputFieldsComponent;

  @ViewChild('privacyCheckbox') public privacyCheckbox!: AuthCheckboxComponent;
  @ViewChild('rememberMeCheckbox') public rememberMeCheckbox!: AuthCheckboxComponent;

  @Input() public isLogin = false;
  @Input() public isLoading = false;
  @Input() public emptyFildsEmpty = false;
  @Input() public isForgotPassword = false;
  @Input() public errorPhat = '';

  public showPassword = false;
  public showConfirmPassword = false;
  public errorMessage = '';

  private isError = false;

  @Output() public tryToSignUp = new EventEmitter<AuthData>();
  @Output() public tryToLogin = new EventEmitter<AuthData>();
  @Output() public tryToResetPW = new EventEmitter<string>();
  @Output() badgeAnimation = new EventEmitter<BadgeMessage>();


  constructor(private afAuth: AngularFireAuth, private router: Router, private userService: UserService, public helperService: HelperService) { }


  /**
   * Initializes the component after the view has been fully initialized.
   * 
   * Checks if a saved email is available in local storage and sets it in the email input field if found.
   * Also restores the "Remember Me" checkbox state.
   */
  public ngAfterViewInit(): void {
    const savedEmail = localStorage.getItem('email');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && this.emailField && this.isLogin) {
      this.emailField.setValue(savedEmail);
      this.rememberMeCheckbox.checkboxValue = rememberMe;
    }
  }


  /**
   * Handles changes in the input properties of the component.
   * 
   * If emptyFildsEmpty changes, calls emptyInputFields().
   * If errorPhat changes, handles Firebase errors.
   * 
   * @param {SimpleChanges} SimpleChange - The changes in input properties.
   */
  public ngOnChanges(SimpleChange: SimpleChanges): void {
    if (this.emptyFildsEmpty && SimpleChange['emptyFildsEmpty']) {
      this.emptyInputFields();
    }
    if (this.errorPhat && SimpleChange['errorPhat']) {
      const error = this.errorPhat;
      this.handleErrorFromFirebase(error);
    }
  }


  /**
   * Handles the form submission.
   * 
   * Depending on the form state (isForgotPassword, isLogin), either initiates the password reset process,
   * retrieves sign-up data, or retrieves login data.
   */
  public onSubmit(): void {
    if (this.isForgotPassword) {
      this.resetPassword();
    }
    else if (!this.isLogin) {
      this.getSignUpData();
    } else {
      this.getLoginData();
    }
  }


  /**
   * Retrieves and processes data for sign-up.
   * 
   * Retrieves name, email, password, and confirmPassword from input fields.
   * Checks the input field values and emits the sign-up data if all values are valid.
   */
  private getSignUpData(): void {
    const name = this.helperService.capitalizeName(this.nameField.getValue());
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField ? this.confirmPasswordField.getValue() : '';
    const checkbox = this.privacyCheckbox.checkboxValue;

    this.checkValueInputFields(name, email, password, confirmPassword, checkbox);
    if (this.isError) {
      this.isError = false;
    } else {
      const singUpData: AuthData = { name, email, password };
      this.tryToSignUp.emit(singUpData);
    }
  }


  /**
   * Retrieves and processes data for login.
   * 
   * Retrieves email and password from input fields and checks the input field values.
   * Emits the login data if all values are valid and manages persistence for "Remember Me".
   */
  private async getLoginData(): Promise<void> {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const rememberMe = this.rememberMeCheckbox.checkboxValue;

    this.persistenceRememberMe(rememberMe, email);
    this.checkLoginInputFields(email, password);
    if (this.isError) {
      this.isError = false;
    } else {
      const loginData: AuthData = { email, password };
      this.tryToLogin.emit(loginData);
    }
  }


  /**
   * Initiates the password reset process.
   * 
   * Emits the email address for password reset if the email field is not empty.
   * Displays an error message if the email field is empty.
   */
  public resetPassword(): void {
    if (this.emailField.inputValue) {
      this.tryToResetPW.emit(this.emailField.inputValue);
    } else {
      this.emailField.errorMessage = 'Please enter your email address.';
    }
  }


  /**
   * Handles guest login.
   * 
   * Signs in the user as a guest and navigates to the summary page.
   * Logs an error message if the guest login fails.
   */
  public onGuestLogin(): void {
    this.isLoading = true;
    this.userService.signInAsGuest()
      .then(() => {
        this.isLoading = false;
        this.router.navigate(['/summary']);
      })
      .catch((error) => {
        this.badgeAnimation.emit({ status: true, message: 'Uups, somthing goes wrong!', error: true });
        this.isLoading = false;
      });
  }


  /**
   * Checks the input fields for the login process.
   * 
   * Validates the email and password fields and sets isError if any validation fails.
   * 
   * @param {string} email - The email address.
   * @param {string} password - The password.
   */
  private checkLoginInputFields(email: string, password: string): void {
    this.isError = false;

    if (!this.validateField(this.emailField, email, { required: true })) this.isError = true;
    if (!this.validateField(this.passwordField, password, { required: true })) this.isError = true;
  }


  /**
   * Checks the input fields for the sign-up process.
   * 
   * Validates the name, email, password, and confirmPassword fields.
   * Sets error messages and isError if any validation fails.
   * 
   * @param {string} name - The user's name.
   * @param {string} email - The email address.
   * @param {string} password - The password.
   * @param {string} confirmPassword - The confirmation password.
   * @param {boolean} checkbox - The value of the privacy policy acceptance checkbox.
   */
  private checkValueInputFields(name: string, email: string, password: string, confirmPassword: string, checkbox: boolean): void {
    this.isError = false;

    if (!this.validateField(this.nameField, name, { required: true })) this.isError = true;
    if (!this.validateField(this.emailField, email, { required: true })) this.isError = true;
    if (!this.validateField(this.passwordField, password, { required: true, minLength: 6 })) this.isError = true;
    if (!this.validateField(this.confirmPasswordField, confirmPassword, { required: true, minLength: 6 })) this.isError = true;

    this.setErrorMessage(password, confirmPassword, checkbox);
  }


  /**
   * Sets error messages for the password and privacy checkbox fields.
   * 
   * Checks if passwords match and if the privacy policy is accepted.
   * Sets the appropriate error messages if any condition is not met.
   * 
   * @param {string} password - The password.
   * @param {string} confirmPassword - The confirmation password.
   * @param {boolean} checkbox - The value of the privacy policy acceptance checkbox.
   */
  public setErrorMessage(password: string, confirmPassword: string, checkbox: boolean): void {
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


  /**
   * Validates a given field based on specified rules.
   * 
   * Validates if the field is required and checks for minimum length if applicable.
   * Sets an error message if the validation fails.
   * 
   * @param {AuthInputFieldsComponent} field - The input field component to validate.
   * @param {string} value - The value of the input field.
   * @param {Object} rules - The validation rules (required, minLength).
   * @returns {boolean} - Whether the field value passes the validation.
   */
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


  /**
   * Handles Firebase errors by setting appropriate error messages for input fields.
   * 
   * @param {any} error - The Firebase error object.
   */
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


  /**
   * Clears the values of all input fields.
   * 
   * Resets the state of the form and its input fields to the initial state.
   */
  public emptyInputFields(): void {
    if (this.isForgotPassword && this.isLogin) {
      this.isLoading = false;
      this.isForgotPassword = false;
    } else if (this.emptyFildsEmpty) {
      this.nameField.inputValue = '';
      this.emailField.inputValue = '';
      this.passwordField.inputValue = '';
      this.confirmPasswordField.inputValue = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.privacyCheckbox.checkboxValue = false;
      this.badgeAnimation.emit({ status: false, message: '', error: false })
      this.isLoading = false;
    }
  }


  /**
   * Manages persistence for the "Remember Me" functionality.
   * 
   * Sets the persistence to local or session based on the "Remember Me" value.
   * Stores or removes the email and rememberMe state in/from local storage.
   * 
   * @param {boolean} rememberMe - The value of the "Remember Me" checkbox.
   * @param {string} email - The email address to remember.
   */
  private async persistenceRememberMe(rememberMe: boolean, email: string): Promise<void> {
    await this.afAuth.setPersistence(rememberMe ? 'local' : 'session');

    if (rememberMe) {
      localStorage.setItem('email', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('rememberMe');
    }
  }
}
