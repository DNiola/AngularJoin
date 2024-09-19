import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;
  public currentTask: Task = { title: '', dueDate: '', category: [], creatorId: this.currentUser?.userId || '' };
  public selectedBubble: Contact[] = [];
  public subtasks: string[] = [];
  public activeButton = '';

  public resetTrigger = false;
  public isError = { title: false, dueDate: false, category: false };

  public contacts: Array<Contact> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange', userId: 1 },
    { name: 'Anton Mayer', initials: 'A M', color: 'red', userId: 2 },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow', userId: 3 },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green', userId: 4 },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray', userId: 5 },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue', userId: 6 },
  ];

  public categories: Array<Category> = [
    { text: 'Technical Task', selected: false },
    { text: 'User history', selected: false },
  ];

  constructor(private userService: UserService, private subtaskService: SubtaskService, private taskService: TaskService,) { }

  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }


  public onDisplayedBubble(selectedContacts: Contact[], section: string): void {
    this.selectedBubble = selectedContacts;
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
  }


  public setTaskData(data: string | User | Category[] | Contact[], section: string): void {
    switch (section) {
      case 'title':
        this.currentTask.title = data as string;
        break;
      case 'description':
        this.currentTask.description = data as string;
        break;
      case 'dueDate':
        this.currentTask.dueDate = data as string;
        break;
      case 'assignedTo':
        this.currentTask.assignedTo = data as Contact[];
        break;
      case 'category':
        this.currentTask.category = data as Category[];
        break;
      default:
        console.warn(`Unbekanntes Feld: ${section}`);
    }
  }

  public onCreateTask(): void {
    this.isError = { title: false, dueDate: false, category: false };
    if (this.currentTask.title === '') {
      this.isError.title = true;
    }
    if (this.currentTask.dueDate === '') {
      this.isError.dueDate = true;
    }
    if (this.currentTask.category.length === 0) {
      this.isError.category = true;
    }
    if (this.isError.title || this.isError.dueDate || this.isError.category) {
      console.error('Fehler beim Erstellen des Tasks:', this.isError);
      return;
    }
    this.currentTask.subtasks = this.subtasks;
    this.currentTask.prio = this.activeButton
    if (this.currentUser) {
      this.currentTask.creatorId = this.currentUser.userId;
    }
    this.createTask();

  }



  private createTask(): void {
    this.taskService.createTask(this.currentTask)
      .then(() => {
        console.log('Task erfolgreich erstellt und gespeichert:', this.currentTask);
        this.clearTask();
      })
      .catch(error => {
        console.error('Fehler beim Speichern des Tasks:', error);
      });
  }


  public clearTask(): void {
    this.activeButton = '';
    this.selectedBubble = [];
    this.resetTrigger = true;
    this.subtaskService.clearSubtasks();
    this.contacts = this.contacts.map(contact => { return { ...contact, selected: false } });
    this.currentTask = { title: '', dueDate: '', category: [], creatorId: this.currentUser?.userId ?? '' };
    setTimeout(() => this.resetTrigger = false, 0);
  }
}

