import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BadgeMessage } from 'src/app/models/badge-messages.model';
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
  public emptyFildsEmpty = false; 

  public firebaseErrorPhat = '';

  public badgeAnimation: BadgeMessage = { status: false, message: '' };

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
      this.badgeAnimation = { status: true, message: 'Uups, somthing goes wrong!', error: true };
      this.finishAnimation();
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
        this.emptyFildsEmpty = true;
        this.badgeAnimation = { status: true, message: 'Email was sucessfully send'};
        this.finishAnimation();
      })
      .catch((error) => {
        this.badgeAnimation = { status: true, message: 'Uups, somthing goes wrong!', error: true };
        this.finishAnimation();
        this.firebaseErrorPhat = error as string;
      });
  }


  public triggerAnimation(badge: BadgeMessage): void {
    this.badgeAnimation = badge;
    this.finishAnimation();
  }


  private finishAnimation(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.badgeAnimation = { status: false, message: '', error: false };
    }, 1000);
  }
}
