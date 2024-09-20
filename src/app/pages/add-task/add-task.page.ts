import { Component, OnInit } from '@angular/core';
import { Category, Categorys } from 'src/app/models/category.model';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { subTask, Task } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;
  public subtasks: subTask[] = [];

  public contacts: Array<Contact> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange', userId: 1 },
    { name: 'Anton Mayer', initials: 'A M', color: 'red', userId: 2 },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow', userId: 3 },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green', userId: 4 },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray', userId: 5 },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue', userId: 6 },
  ];

  public categories: Categorys = [
    { text: 'Technical Task', selected: false, color: this.helperService.getRandomColor() },
    { text: 'User history', selected: false, color: this.helperService.getRandomColor() },
  ];

  constructor(private userService: UserService, private subtaskService: SubtaskService, private helperService: HelperService) { }


  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }

}

