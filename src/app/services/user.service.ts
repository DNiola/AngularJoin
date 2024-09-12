import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | null = null;

  setUser(userData: User) {
    this.user = userData;
  }

  getUser(): User | null {
    return this.user;
  }

  clearUser() {
    this.user = null;
  }
}
