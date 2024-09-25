import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  public currentUser: User | null = null;
  public contacts: Contact[] = [];

  public selectedContact: Contact | null = null;
  public groupedContacts: { [key: string]: Contact[] } = {};

  public isContactCardOpen = false;
  
  constructor(private userService: UserService) { }


  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.contactsInit();
    });
  }


  public contactsInit(): void {
    if (this.currentUser) {
      this.userService.getAllUsers().then((users) => {
        const userContacts = users as Contact[];
        const personalContacts = this.currentUser?.contacts || [];
        if (userContacts) {
          this.contacts = [...userContacts, ...personalContacts];
        }
        this.groupContactsByLetter();
      });
    }
  }


  private groupContactsByLetter(): void {
    this.groupedContacts = {};
    this.contacts.forEach((contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!this.groupedContacts[firstLetter]) {
        this.groupedContacts[firstLetter] = [];
      }
      this.groupedContacts[firstLetter].push(contact);
    });

  }


  public selectContact(contact: Contact): void {
    this.selectedContact = contact;
    this.showContactOverview();
  }


  public showContactOverview() {
    console.log(this.selectedContact);
  }
}
