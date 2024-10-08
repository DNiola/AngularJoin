import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Categorys } from 'src/app/models/category.model';
import { Contact } from 'src/app/models/contact.model';
import { Subtask, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-card-add',
  templateUrl: './task-card-add.component.html',
  styleUrls: ['./task-card-add.component.scss'],
})

export class TaskCardAddComponent implements OnInit {
  @Input() public currentUser: User | null = null;
  @Input() public subtasks: Subtask[] = [];
  @Input() public contacts: Contact[] = [];

  @Input() public taskStatus: Task['status'] = 'todo';
  @Input() public isCard = false;

  @Input() public isEditTask = false;
  @Input() public editTask: Task | null = null;

  @Output() isCardOpen = new EventEmitter<void>();

  public categories: Categorys = [
    { text: 'Technical Task', selected: false, color: '#1FD7C1' },
    { text: 'User history', selected: false, color: '#0038FF' },
  ];

  public currentTask: Task = { title: '', dueDate: '', category: { text: '', selected: false, color: '' }, creatorId: this.currentUser?.userId || '', id: '', status: 'todo' };
  public dialogMessage = { title: '', message: '', action: '' };

  public isError = { title: false, dueDate: false, category: false };
  public resetTrigger = false;
  public isCardClosed = false;

  public selectedBubble: Contact[] = [];
  public activeButton = '';

  public isAnimation = false;
  public isDialog = false;

  constructor(private subtaskService: SubtaskService, private taskService: TaskService, private router: Router) { }


  public ngOnInit(): void {
    if (this.isEditTask) {
      this.currentTask = { ...this.editTask } as Task;
      this.taskStatus = this.editTask?.status as Task['status'];
      this.selectedBubble = this.currentTask.assignedTo || [];
      this.activeButton = this.currentTask.prio || '';
      this.subtasks = this.currentTask.subtasks || [];
    }
  }


  public onCreateTask(isCreate: boolean): void {
    this.checkRequiredFields();
    if (this.isError.title || this.isError.dueDate || this.isError.category) {
      console.error('Fehler beim Erstellen des Tasks:', this.isError);
      this.isDialog = false;
      return;
    }
    this.getTaskData();
    if (isCreate) {
      this.createTask();
    } else {
      this.editTaskData();
    }
  }


  public editTaskData(): void {
    this.taskService.updateTask(this.currentTask).then(() => {
      this.onCloseCard();
    }).catch(error => {
      console.error('Fehler beim Aktualisieren des Tasks:', error);
    });
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
    this.currentTask.status = this.taskStatus;
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
        this.isAnimation = true;
        this.clearTask();
        setTimeout(() => {
          this.router.navigate(['/board']);
        }, 1000);
      })
      .catch(error => {
        console.error('Fehler beim Speichern des Tasks:', error);
      });
  }


  public clearTask(): void {
    this.activeButton = '';
    this.selectedBubble = [];
    this.resetTrigger = true;
    this.isDialog = false
    this.subtaskService.clearSubtasks();
    this.contacts = this.contacts.map(contact => { return { ...contact, selected: false } });
    this.currentTask = { title: '', dueDate: '', category: { text: '', selected: false, color: '' }, creatorId: this.currentUser?.userId ?? '', status: 'todo', id: '' };
    setTimeout(() => {
      this.resetTrigger = false;
      this.isAnimation = false;
    }, 1000);
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


  public onDisplayedSubtask(newSubtasks: Subtask[]): void {
    this.subtaskService.updateSubtasks(newSubtasks);
  }


  public onOpenDialog(action: 'clear' | 'create' | 'edit'): void {
    if (action === 'clear') {
      this.dialogMessage = { title: 'Clear Task?', message: 'Are you sure you want to clear the task?', action: action }
    } if (action === 'create') {
      this.dialogMessage = { title: 'Create Task?', message: 'Are you sure you want to create the task?', action: action }
    } else {
      this.dialogMessage = { title: 'Edit Task?', message: 'Are you sure you want to edit the task?', action: action }
    }
    this.isDialog = true
  }


  public onCloseCard(): void {
    this.clearTask();
    this.isCardOpen.emit();
  }
}
