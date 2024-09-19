import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  @Input() selectedData: Contact[] = [];
  @Input() subtasks: string[] = [];
  @Input() outputValue: any = {};

  public currentTask: any = {};
  public currentUser: User | null = null;
  public activeButton = '';



  public contacts: Array<Contact> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange', userId: 1 },
    { name: 'Anton Mayer', initials: 'A M', color: 'red', userId: 2 },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow', userId: 3 },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green', userId: 4 },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray', userId: 5 },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue', userId: 6 },
  ];

  public categories: Array<any> = [
    { text: 'Technical Task' },
    { text: 'User history' },
  ];

  constructor(private userService: UserService, private subtaskService: SubtaskService) { }

  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }


  public onDisplayedBubble(selectedContacts: Contact[], section: string): void {
    this.selectedData = selectedContacts;
    this.setTaskData(selectedContacts, section);
  }


  public setActiveButton(button: string): void {
    this.activeButton = button;
    this.setTaskData(this.activeButton, 'prio');
  }


  public isButtonActive(button: string): boolean {
    return this.activeButton === button;
  }


  public onDisplayedSubtask(newSubtasks: string[]): void {
    this.subtaskService.updateSubtasks(newSubtasks);
    this.setTaskData(newSubtasks, 'subtasks');
  }


  public setTaskData(data: any, section: string): void {
    this.currentTask[section] = data;
  }


  public createTask(): void {
    this.currentTask['subtasks'] = this.subtasks;
    this.currentTask.creator = this.currentUser?.userId;
    console.log('Task wird erstellt:', this.currentTask);
  }


  public clearTask(): void {
    this.currentTask = {};
    this.subtaskService.clearSubtasks();
  }
}

