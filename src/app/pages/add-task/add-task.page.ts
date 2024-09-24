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
      this.contactsInit();
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }
  

  public contactsInit(): void {
    if (this.currentUser) {
      this.userService.getAllUsers(this.currentUser.userId).then(users => {
        this.contacts = users as Contact[]
      });
    }
  }
}

