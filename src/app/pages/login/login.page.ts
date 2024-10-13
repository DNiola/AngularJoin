import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthData, User } from 'src/app/models/user.model';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public isError = false;
  public isLoading = false;
  public isAnimation = false;
  public isForgotPassword = false;

  public firebaseErrorPhat = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private userService: UserService,
    public helperService: HelperService
  ) { }


  /**
   * Handles user login using the provided authentication data.
   *
   * @param {AuthData} loginData - The user's login credentials including email and password.
   * @returns {Promise<void>} Resolves when login is successful and redirects to the summary page, or sets an error message on failure.
   */
  public async onLogin(loginData: AuthData): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(loginData.email, loginData.password);
      const user = result.user;

      const userDataSnapshot = await this.firestore.collection('users').doc(user?.uid).get().toPromise();
      const userData = userDataSnapshot?.data() as User;

      this.userService.setUser({
        userId: user?.uid || '',
        name: userData.name || '',
        email: user?.email || '',
        initials: userData.initials,
        color: userData.color,
        contacts: userData.contacts
      });
      
      this.isLoading = false;
      this.router.navigate(['/summary']);
    } catch (error) {
      this.isLoading = false;
      this.firebaseErrorPhat = error as string;
    }
  }


  /**
   * Handles password reset for the user based on the provided email address.
   *
   * @param {string} email - The user's email address for password recovery.
   * @returns {void}
   */
  public onResetPassword(email: string): void {
    this.isLoading = true;
    this.userService.resetPassword(email)
      .then(() => {
        this.isAnimation = true;
        this.isForgotPassword = false;
        setTimeout(() => {
          this.isLoading = false;
          this.isAnimation = false;
        }, 1000);
      })
      .catch((error) => {
        this.isLoading = false;
        this.firebaseErrorPhat = error as string;
      });
  }

}
