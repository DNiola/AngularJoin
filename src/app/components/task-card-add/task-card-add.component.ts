import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Contact } from 'src/app/models/contact.model';
import { subTask, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-card-add',
  templateUrl: './task-card-add.component.html',
  styleUrls: ['./task-card-add.component.scss'],
})

export class TaskCardAddComponent {
  @Input() public currentUser: User | null = null;
  @Input() public contacts: Contact[] = [];
  @Input() public categories: Category[] = [];
  @Input() public subtasks: subTask[] = [];

  public resetTrigger = false;
  public isError = { title: false, dueDate: false, category: false };

  public selectedBubble: Contact[] = [];
  public activeButton = '';

  public currentTask: Task = { title: '', dueDate: '', category: { text: '', selected: false, color: '' }, creatorId: this.currentUser?.userId || '', id: '', status: 'todo' };

  constructor(private subtaskService: SubtaskService, private taskService: TaskService,) { }


  public onCreateTask(): void {
    this.checkRequiredFields();
    if (this.isError.title || this.isError.dueDate || this.isError.category) {
      console.error('Fehler beim Erstellen des Tasks:', this.isError);
      return;
    }
    this.getTaskData();
    this.createTask();
  }


  private getTaskData(): void {
    this.currentTask.prio = this.activeButton
    if (this.currentTask.prio === '') {
      this.currentTask.prio = 'low';
    }

    if (this.currentUser) {
      this.currentTask.creatorId = this.currentUser.userId;
    }
    this.currentTask.subtasks = this.subtasks;
  }


  private checkRequiredFields(): void {
    this.isError = { title: false, dueDate: false, category: false };

    if (this.currentTask.title === '') {
      this.isError.title = true;
    }
    if (this.currentTask.dueDate === '') {
      this.isError.dueDate = true;
    }
    if (this.currentTask.category.text === '') {
      this.isError.category = true;
    }
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
    this.currentTask = { title: '', dueDate: '', category: { text: '', selected: false, color: '' }, creatorId: this.currentUser?.userId ?? '', status: 'todo', id: '' };
    setTimeout(() => this.resetTrigger = false, 0);
  }


  public setTaskData(data: string | Category | Contact[], section: string): void {
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
        this.currentTask.category = data as Category;
        break;
      default:
        console.warn(`Unbekanntes Feld: ${section}`);
    }
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


  public onDisplayedSubtask(newSubtasks: subTask[]): void {
    this.subtaskService.updateSubtasks(newSubtasks);
  }
}
