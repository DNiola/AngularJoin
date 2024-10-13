import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subtask } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;
  public contacts: Contact[] = [];
  public subtasks: Subtask[] = [];
  public isAnimation = false;

  constructor(private userService: UserService, private subtaskService: SubtaskService) { }

  /**
   * Initializes the AddTaskPage component.
   *
   * Subscribes to the currentUser and subtasks observables to keep track of the user and subtask data.
   * Populates the contacts list based on the current user.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.contactsInit(this.currentUser!);
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }

  /**
   * Initializes the contacts list based on the current user's contacts and all available users.
   * Filters out hidden contacts and marks the current user in the contact list.
   *
   * @param {User} currentUser - The current user object.
   * @returns {void}
   */
  public contactsInit(currentUser: User): void {
    this.userService.getAllUsers().then(users => {
      const userContacts = users as Contact[];
      const personalContacts = currentUser?.contacts || [];
      const visibleUserContacts = userContacts.filter((contact) => !currentUser?.hidden?.includes(contact.userId));
      
      this.contacts = [...visibleUserContacts, ...personalContacts].map(contact => {
        if (contact?.userId === currentUser?.userId) {
          return { ...contact, name: `${contact.name} (You)` };
        }
        return contact;
      });
    });
  }


  /**
   * Change the animation state of the AddTaskPage component.
   *
   * @param {boolean} animationStatus - The new animation state.
   * @returns {void}
   */
  public triggerAnimation(animationStatus: boolean): void {
    this.isAnimation = animationStatus;
  }

}
