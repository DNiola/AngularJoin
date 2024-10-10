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

  constructor(private userService: UserService, private subtaskService: SubtaskService) { }


  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.contactsInit(this.currentUser!);
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }


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
  

}

