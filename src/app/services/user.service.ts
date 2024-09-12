import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }


  private async loadUserData(uid: string) {
    const userDataSnapshot = await this.firestore.collection('users').doc(uid).get().toPromise();
    const userData = userDataSnapshot?.data() as User;
    if (userData) {
      this.currentUserSubject.next({
        userId: uid,
        name: userData.name,
        email: userData.email || '',
        initials: userData.initials,
        color: userData.color
      });
    }
  }


  setUser(userData: User) {
    this.currentUserSubject.next(userData);
  }


  getUser() {
    return this.currentUserSubject.getValue();
  }

  clearUser() {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
}
