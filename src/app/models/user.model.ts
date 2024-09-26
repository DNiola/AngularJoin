import { Contact } from "./contact.model";

export interface User {
    userId: string;
    name: string;
    email: string;
    initials: string;
    color: string;
    contacts: Contact[];
    hidden?: string[]; 
  }
  