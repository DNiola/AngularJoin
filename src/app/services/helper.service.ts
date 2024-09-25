import { Injectable } from '@angular/core';
import { AuthInputFieldsComponent } from '../components/auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../components/auth-checkbox/auth-checkbox.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public getRandomColor(): string {
    const colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  public getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names[0][0] + (names[1] ? ' ' + names[1][0] : '');
    return initials.toUpperCase();
  }


  public capitalizeName(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  public EmptyErrorField(fieldName: AuthInputFieldsComponent | AuthCheckboxComponent): void {
    fieldName.errorMessage = '';
  }
}
