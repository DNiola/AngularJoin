import { Injectable } from '@angular/core';
import { AuthInputFieldsComponent } from '../components/auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../components/auth-checkbox/auth-checkbox.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  /**
   * Generates a random color from a predefined list of colors.
   * 
   * @returns {string} A randomly selected color in hexadecimal format.
   */
  public getRandomColor(): string {
    const colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  /**
   * Extracts the initials from a given name.
   * 
   * @param {string} name - The full name of the user.
   * @returns {string} The initials of the user, separated by a space if applicable.
   * 
   * This function splits the provided name into parts and takes the first character from each part to form the initials.
   */
  public getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names[0][0] + (names[1] ? ' ' + names[1][0] : '');
    return initials.toUpperCase();
  }


  /**
   * Capitalizes the first letter of each word in a given name.
   * 
   * @param {string} name - The full name to be capitalized.
   * @returns {string} The name with each word's first letter capitalized.
   * 
   * This function ensures that the first letter of each word is in uppercase, while the rest of the word is in lowercase.
   */
  public capitalizeName(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  /**
   * Clears the error message of the specified field.
   * 
   * @param {AuthInputFieldsComponent | AuthCheckboxComponent} fieldName - The field for which the error message needs to be cleared.
   * 
   * This function resets the error message for an input field or a checkbox component.
   */
  public EmptyErrorField(fieldName: AuthInputFieldsComponent | AuthCheckboxComponent): void {
    fieldName.errorMessage = '';
  }
}
