import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  /**
   * Initializes the UserService and sets up authentication state subscription.
   *
   * @param {AngularFireAuth} afAuth - The Firebase Authentication service.
   * @param {AngularFirestore} firestore - The Firestore database service.
   */
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }


  /**
   * Loads the user data from Firestore based on the provided user ID.
   *
   * @param {string} uid - The unique user ID.
   * @returns {Promise<void>} A promise that resolves when the user data is loaded.
   */
  public async loadUserData(uid: string): Promise<void> {
    const userDataSnapshot = await this.firestore.collection('users').doc(uid).get().toPromise();
    const userData = userDataSnapshot?.data() as User;
    if (userData) {
      this.currentUserSubject.next(userData);
    }
  }


  /**
   * Retrieves all users from Firestore.
   *
   * This function fetches all users from the Firestore database and returns them as an array.
   * If no users are found, an empty array is returned.
   *
   * @returns {Promise<User[]>} A promise that resolves with an array of all user objects, or an empty array if no users are found.
   */
  public async getAllUsers(): Promise<User[]> {
    const allUsersSnapshot = await this.firestore.collection('users').get().toPromise();
    const contacts = allUsersSnapshot?.docs.map(doc => {
      const userData = doc.data() as User;
      return userData;
    }) || [];

    return contacts;
  }


  /**
   * Sets the current user.
   *
   * @param {User} userData - The user data to be set as the current user.
   */
  public setUser(userData: User): void {
    this.currentUserSubject.next(userData);
  }


  /**
   * Retrieves the current user.
   *
   * @returns {User | null} The current user or null if no user is logged in.
   */
  public getUser(): User | null {
    return this.currentUserSubject.getValue();
  }


  /**
   * Clears the current user and signs out from Firebase authentication.
   *
   * @returns {Promise<void>} A promise that resolves when the user is signed out.
   */
  public clearUser(): void {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
    }).catch((error) => {
      throw error;
    });
  }


  /**
   * Signs in as a guest user with predefined credentials.
   *
   * @returns {Promise<void>} A promise that resolves when the guest user is signed in.
   */
  public async signInAsGuest(): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword('Guest@User.com', '123123')
      .then((userCredential) => {
        this.currentUserSubject.next({
          userId: userCredential.user?.uid || 'guest_user',
          name: 'Guest User',
          email: 'Guest@User.com',
          initials: 'G',
          color: '#2A3647',
          creatorId: 'guest_user',
          isGuest: true,
          contacts: []
        } as User);
      })
      .catch((error) => {
        throw error;
      });
  }


  /**
   * Sends a password reset email to the specified email address.
   *
   * @param {string} email - The email address to send the password reset link to.
   * @returns {Promise<void>} A promise that resolves when the password reset email is sent.
   */
  public async resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => { })
      .catch((error) => {
        throw error;
      });
  }
}
