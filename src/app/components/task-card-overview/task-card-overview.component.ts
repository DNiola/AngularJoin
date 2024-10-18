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
  @Output() badgeAnimation = new EventEmitter<{ status: boolean, message: string, error: boolean }>();
  
  public category: Category | null = null;
  public isDialog = false;
  public isDropdownOpen = false;

  public statusItem = ['To do', 'In progress', 'Awaiting feedback', 'Done'];
  public selectedItem = '';

  constructor(private taskService: TaskService) { }


  /**
   * Initializes the component by setting the category and selected status item.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.initCategory();
    this.initSelectedItem();
  }


  /**
   * Initializes the selected status item based on the task's status.
   *
   * @returns {void}
   */
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


  /**
   * Updates the task's status based on the selected item from the dropdown.
   *
   * @param {string} selectedItem - The newly selected status item.
   * @returns {void}
   */
  public onSelectNewStatus(selectedItem: string): void {
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
      this.taskService.updateTask(this.task)
    }
    this.isDropdownOpen = false;
  }


  /**
   * Toggles the visibility of the dropdown for selecting task status.
   *
   * @returns {void}
   */
  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  /**
   * Initializes the category for the task if available.
   *
   * @returns {void}
   */
  private initCategory(): void {
    const category = this.task?.category;
    if (category) {
      this.category = category;
    }
  }


  /**
   * Emits an event to close the task card.
   *
   * @returns {void}
   */
  public onCloseCard(): void {
    this.isCardOpen.emit();
  }


  /**
   * Updates the status of a subtask based on the checkbox change event.
   *
   * @param {number} subtaskIndex - The index of the subtask to update.
   * @param {Event} event - The checkbox change event.
   * @returns {void}
   */
  public onSubtaskStatusChange(subtaskIndex: number, event: any): void {
    const done = event.detail.checked;
    if (this.task && this.task.id) {
      this.taskService.updateSubtaskStatus(this.task.id, subtaskIndex, done)
    }
  }


  /**
   * Emits an event to edit the task.
   *
   * @returns {void}
   */
  public onEditTask(): void {
    if (this.task) {
      this.editTask.emit(this.task);
    }
  }


  /**
   * Deletes the task and closes the task card.
   *
   * @returns {void}
   */
  public onDeleteTask(): void {
    if (this.task && this.task.id) {
      this.taskService.deleteTask(this.task.id).then(() => {
        this.onCloseCard();
      }).catch(error => {
        this.badgeAnimation.emit({ status: true, message: 'Uups, somthing goes wrong!', error: true });
      });
    }
  }
}