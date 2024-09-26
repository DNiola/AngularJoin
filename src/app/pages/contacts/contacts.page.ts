import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { ContactService } from 'src/app/services/contact.service';
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
  public isEditContact = false;

  constructor(private userService: UserService, private contactService: ContactService) { }


  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.contactsInit(this.currentUser);
      }
    });
  }


  public contactsInit(currentUser: User): void {
    this.userService.getAllUsers().then((users) => {
      const userContacts = users as Contact[];
      const personalContacts = currentUser.contacts || [];
      const visibleUserContacts = userContacts.filter((contact) => !currentUser.hidden?.includes(contact.userId));
      this.contacts = [...visibleUserContacts, ...personalContacts];
      this.groupContactsByLetter();
    });

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


  public handleContact(action: any): void {
    if (action.action === 'delete' && this.currentUser) {
      this.handleDeleteContact(this.selectedContact!, this.currentUser);
    } else if (action.action === 'edit' && this.currentUser) {
      this.editContact();
    }
  }


  private editContact(): void {
    this.isEditContact = true;
    this.isContactCardOpen = true;
  }


  public handleDeleteContact(contact: Contact, currentUser: User): void {
    if (contact.creatorId) {
      this.deleteContact(currentUser, contact);
    } else {
      this.hiddeUserContact(currentUser, contact);
    }
  }


  private deleteContact(currentUser: User, contact: Contact): void {
    this.contactService.deleteUserContact(currentUser.userId, contact.userId)
      .then(() => {
        this.contacts = this.contacts.filter((c) => c.userId !== contact.userId);
        this.selectedContact = null;
        this.groupContactsByLetter();
      })
      .catch((error) => {
        console.error('Fehler beim Löschen des Kontakts:', error);
      });
  }


  private hiddeUserContact(currentUser: User, contact: Contact): void {
    this.contactService.hideUserForCurrentUser(currentUser.userId, contact)
      .then(() => {
        this.contacts = this.contacts.filter((c) => c.userId !== contact.userId);
        this.selectedContact = null;
        this.groupContactsByLetter();
      })
      .catch((error) => {
        console.error('Fehler beim Verstecken des Benutzers:', error);
      });
  }


  public onContactCreated(newContact: Contact): void {
    this.isContactCardOpen = false;
    if (newContact) {
      if (this.isEditContact) {
        const index = this.contacts.findIndex(c => c.userId === newContact.userId);
        index !== -1 ? this.contacts[index] = newContact : this.contacts.push(newContact);
      } else {
        this.contacts.push(newContact);
      }
      this.groupContactsByLetter();
    }
    this.isEditContact = false;
  }



  public selectContact(contact: Contact): void {
    this.selectedContact = contact;
  }


  public onOpenAddContact(): void {
    this.isEditContact = false;
    this.isContactCardOpen = true
  }

}
