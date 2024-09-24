import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();


  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }


  private async loadUserData(uid: string): Promise<void> {
    const userDataSnapshot = await this.firestore.collection('users').doc(uid).get().toPromise();
    const userData = userDataSnapshot?.data() as User;
    if (userData) {
      this.currentUserSubject.next({
        userId: uid,
        name: userData.name,
        email: userData.email || '',
        initials: userData.initials,
        color: userData.color,
        contacts: [] 
      });
    }
  }


  public async getAllUsers(currentUserId: string) {
    const allUsersSnapshot = await this.firestore.collection('users').get().toPromise();
    const contacts = allUsersSnapshot?.docs.map(doc => {
      const userData = doc.data() as User;
      return {
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        initials: userData.initials,
        color: userData.color
      };
    }) 
    
    return contacts;
  }


  public setUser(userData: User): void {
    this.currentUserSubject.next(userData);
  }


  public getUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  public clearUser(): void {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }
}
