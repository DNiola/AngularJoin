import { Component, OnInit } from '@angular/core';
import { BadgeMessage } from 'src/app/models/badge-messages.model';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { ContactService } from 'src/app/services/contact.service';
import { TaskService } from 'src/app/services/task.service';
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
  public badgeAnimation: BadgeMessage = { status: false, message: '' };

  public isContactCardOpen = false;
  public isEditContact = false;
  public isDialog = false;
  public isLoading = false;

  constructor(private userService: UserService, private contactService: ContactService, private taskService: TaskService) { }


  /**
   * Initializes the component by subscribing to the current user and loading their contacts.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.contactsInit(this.currentUser);
      }
    });
  }


  /**
   * Initializes contacts for the current user by fetching all users and personal contacts.
   *
   * @param {User} currentUser - The current user whose contacts need to be initialized.
   * @returns {void}
   */
  public contactsInit(currentUser: User): void {
    this.userService.getAllUsers().then((users) => {
      const userContacts = users as Contact[];
      const personalContacts = currentUser.contacts || [];
      const visibleUserContacts = userContacts.filter((contact) => !currentUser.hidden?.includes(contact.userId));
      this.contacts = [...visibleUserContacts, ...personalContacts];
      this.groupContactsByLetter();
    });
  }


  /**
   * Groups contacts by the first letter of their name for easier navigation.
   *
   * @returns {void}
   */
  private groupContactsByLetter(): void {
    this.groupedContacts = {};
    this.contacts.forEach((contact) => {
      let contactName = contact.name;
      const firstLetter = contactName.charAt(0).toUpperCase();
      if (!this.groupedContacts[firstLetter]) {
        this.groupedContacts[firstLetter] = [];
      }
      this.groupedContacts[firstLetter].push({ ...contact, name: contactName });
    });
  }


  /**
   * Handles actions related to a contact, such as deleting or editing the contact.
   *
   * @param {any} action - The action to be performed on the contact (e.g., delete or edit).
   * @returns {void}
   */
  public handleContact(action: any): void {
    if (action.action === 'delete' && this.currentUser) {
      this.handleDeleteContact(this.selectedContact!, this.currentUser);
    } else if (action.action === 'edit' && this.currentUser) {
      this.setEditContact();
    }
  }


  /**
   * Sets the selected contact into edit mode.
   *
   * @returns {void}
   */
  private setEditContact(): void {
    this.isEditContact = true;
    this.isContactCardOpen = true;
  }


  /**
   * Handles the deletion of a contact, either by removing it or hiding it from the current user.
   *
   * @param {Contact} contact - The contact to be deleted or hidden.
   * @param {User} currentUser - The current user performing the action.
   * @returns {void}
   */
  public handleDeleteContact(contact: Contact, currentUser: User): void {
    contact.creatorId ? this.deleteContact(currentUser, contact) : this.hiddeUserContact(currentUser, contact);
  }


  /**
   * Deletes a contact from the current user's contact list and task.
   *
   * @param {User} currentUser - The current user performing the deletion.
   * @param {Contact} contact - The contact to be deleted.
   * @returns {void}
   */
  private deleteContact(currentUser: User, contact: Contact): void {
    this.isLoading = true;
    this.contactService.deleteUserContact(currentUser.userId, contact.userId)
      .then(() => {
        this.removeContactFromTask(contact);
        this.removeContactFromList(contact);
        this.badgeAnimation = { status: true, message: 'Contact was successfully deleted' };
        this.finishAnimation();
      })
      .catch((error) => {
        this.badgeAnimation = { status: true, message: 'Uups, somthing goes wrong!', error: true };
        this.finishAnimation();
      });
    this.closeContactCard();
  }


  /**
   * Hides a user contact from the current user's contact list and task.
   *
   * @param {User} currentUser - The current user performing the action.
   * @param {Contact} contact - The contact to be hidden.
   * @returns {void}
   */
  private hiddeUserContact(currentUser: User, contact: Contact): void {
    this.isLoading = true;
    this.contactService.hideUserForCurrentUser(currentUser.userId, contact)
      .then(() => {
        this.removeContactFromTask(contact);
        this.removeContactFromList(contact);
        this.badgeAnimation = { status: true, message: 'Contact was successfully deleted' };
        this.finishAnimation();
      })
      .catch((error) => {
        this.badgeAnimation = { status: true, message: 'Contact was successfully deleted' };
        this.finishAnimation();
      });
    this.closeContactCard();
  }


  /**
   * Removes a contact from all tasks they are assigned to.
   *
   * This method fetches all tasks and iterates through them to check if the specified contact
   * is assigned to any of them. If the contact is found in the assigned list of a task, they are
   * removed from the list, and the task is updated.
   *
   * @param {Contact} contact - The contact to be removed from all tasks.
   * @returns {void}
   */
  private removeContactFromTask(contact: Contact): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      const allTasks = tasks;
      allTasks.forEach(task => {
        if (task.assignedTo?.some(assignedContact => assignedContact.userId === contact?.userId)) {
          task.assignedTo = task.assignedTo.filter(assignedContact => assignedContact.userId !== contact?.userId);
          this.taskService.updateTask(task);
        }
      });
    });
  }


  /**
   * Removes a contact from the contact list, reloads the current user's data, 
   * resets the selected contact, and re-groups the contacts by the first letter of their name.
   *
   * @param {Contact} contact - The contact to be removed from the list.
   * @returns {void}
   */
  private removeContactFromList(contact: Contact): void {
    this.contacts = this.contacts.filter((c) => c.userId !== contact.userId);
    this.userService.loadUserData(this.currentUser?.userId as User['userId']);
    this.selectedContact = null;
    this.groupContactsByLetter();
  }


  /**
   * Handles the creation of a new contact by either adding or editing it.
   *
   * @param {Contact} newContact - The contact to be created or edited.
   * @returns {void}
   */
  public onContactCreated(newContact: Contact): void {
    this.isContactCardOpen = false;
    if (newContact) {
      this.handleCreateNewContact(newContact);
    }
    this.isEditContact = false;
  }


  /**
   * Processes the creation of a new contact or the editing of an existing contact.
   *
   * @param {Contact} newContact - The contact to be created or edited.
   * @returns {void}
   */
  public handleCreateNewContact(newContact: Contact): void {
    if (this.isEditContact) {
      this.editContact(newContact);
    } else {
      this.pushNewContact(newContact);
    }
    this.selectedContact = newContact;
    this.groupContactsByLetter();
  }


  /**
   * Edits an existing contact in the contact list.
   *
   * @param {Contact} newContact - The contact with updated information.
   * @returns {void}
   */
  public editContact(newContact: Contact): void {
    const index = this.contacts.findIndex(c => c.userId === newContact.userId);
    index !== -1 ? this.contacts[index] = newContact : this.contacts.push(newContact);
  }


  /**
   * Adds a new contact to the contact list and manages the animation state.
   *
   * @param {Contact} newContact - The new contact to be added.
   * @returns {void}
   */
  public pushNewContact(newContact: Contact): void {
    this.contacts.push(newContact);
  }


  /**
   * Selects a contact to be displayed in detail.
   *
   * @param {Contact} contact - The contact to be selected.
   * @returns {void}
   */
  public selectContact(contact: Contact): void {
    this.selectedContact = contact;
  }


  /**
   * Opens the form to create a new contact.
   *
   * @returns {void}
   */
  public onOpenAddContact(): void {
    this.isEditContact = false;
    this.isContactCardOpen = true;
  }


  /**
   * Opens the dialog to delete the selected contact.
   *
   * @returns {void}
   */
  public onOpenDialog(dialogStatus: boolean): void {
    this.isDialog = dialogStatus;
  }


  /**
 * Emits an event to delete the selected contact and closes the confirmation dialog.
 *
 * @param {Contact} contact - The contact to be deleted.
 * @returns {void}
 */
  public onDeleteContact(contact: Contact): void {
    this.handleContact({ action: 'delete', contact });
    this.isDialog = false;
  }


  /**
   * Closes the contact card and resets the animation and dialog states.
   *
   * @returns {void}
   */
  public closeContactCard(): void {
    this.isContactCardOpen = false;
    this.isDialog = false;
  }


  public triggerAnimation(badge: BadgeMessage): void {
    this.badgeAnimation = badge;
    this.finishAnimation();
  }


  private finishAnimation(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.badgeAnimation = { status: false, message: '', error: false };
    }, 1000);
  }
}
