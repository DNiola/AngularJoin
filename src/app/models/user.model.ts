import { Contact } from "./contact.model";

export interface User {
    userId: string;
    name: string;
    email: string;
    initials: string;
    color: string;
    contacts: Contact[];
    hidden?: string[]; 
    isGuest?: boolean;
  }
  

  export interface AuthData {
    name?: string;
    email: string;
    password: string;
}