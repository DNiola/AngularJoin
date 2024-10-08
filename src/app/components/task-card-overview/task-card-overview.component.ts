import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-card-overview',
  templateUrl: './task-card-overview.component.html',
  styleUrls: ['./task-card-overview.component.scss'],
})
export class TaskCardOverviewComponent implements OnInit {
  @Input() task: Task | null = null;


  @Output() isCardOpen = new EventEmitter<void>();
  @Output() editTask = new EventEmitter<Task>();

  public category: Category | null = null;
  public isDialog = false;
  public isDropdownOpen = false;

  public statusItem = ['To do', 'In progress', 'Awaiting feedback', 'Done'];
  public selectedItem = '';

  constructor(private taskService: TaskService) {

  }

  public ngOnInit(): void {
    this.initCategory();
    this.initSelectedItem();
  }


  private initSelectedItem(): void {
    if (this.task?.status === 'todo') {
      this.selectedItem = 'To do';
    }
    if (this.task?.status === 'inProgress') {
      this.selectedItem = 'In progress';
    }
    if (this.task?.status === 'awaitFeedback') {
      this.selectedItem = 'Await feedback';
    }
    if (this.task?.status === 'done') {
      this.selectedItem = 'Done';
    }
  }

  
  public onSelectNewStatus(selectedItem: any): void {
    this.selectedItem = selectedItem;
    if (this.task) {
      if (this.selectedItem === 'To do') {
        this.task.status = 'todo';
      }
      if (this.selectedItem === 'In progress') {
        this.task.status = 'inProgress';
      }
      if (this.selectedItem === 'Await feedback') {
        this.task.status = 'awaitFeedback';
      }
      if (this.selectedItem === 'Done') {
        this.task.status = 'done';
      }
      this.taskService.updateTask(this.task).then(() => {
      }).catch(error => {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
      });
    }
    this.isDropdownOpen = false;
  }

  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }


  private initCategory(): void {
    if (Array.isArray(this.task?.category) && this.task?.category.length > 0) {
      const category = this.task?.category?.[0];
      if (category) {
        this.category = category
      }
    }
  }


  public onCloseCard(): void {
    this.isCardOpen.emit();
  }


  public onSubtaskStatusChange(subtaskIndex: number, event: any): void {
    const done = event.detail.checked;
    if (this.task && this.task.id) {
      this.taskService.updateSubtaskStatus(this.task.id, subtaskIndex, done).then(() => {
      }).catch(error => {
        console.error('Fehler beim Aktualisieren des Subtask-Status:', error);
      });
    }
  }


  public onEditTask(): void {
    if (this.task) {
      this.editTask.emit(this.task);
    }
  }


  public onDeleteTask(): void {
    if (this.task && this.task.id) {
      this.taskService.deleteTask(this.task.id).then(() => {
        this.onCloseCard();

      }).catch(error => {
        console.error('Fehler beim Löschen des Tasks:', error);
      });
    }
  }
}
