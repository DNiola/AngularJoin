import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-board-section',
  templateUrl: './board-section.component.html',
  styleUrls: ['./board-section.component.scss'],
})
export class BoardSectionComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() tasks: Task[] = [];
  @Input() status: Task['status'] = 'todo';

  @Output() taskDropped = new EventEmitter<{ task: Task, newStatus: string }>();
  @Output() openAddTask = new EventEmitter<Task['status']>();
  @Output() openTaskCard = new EventEmitter<Task>();

  public isDragOver: boolean = false;
  public connectedDropLists: string[] = ['todo', 'inProgress', 'done', 'awaitFeedback'];


  /**
   * Handles the drop event when a task is moved via drag-and-drop.
   * Updates the task list by rearranging tasks within the same list
   * or transferring tasks between different lists.
   * Emits an event to notify about the task's new status.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event data.
   */
  public drop(event: CdkDragDrop<Task[]>): void {
    this.isDragOver = false;

    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const movedTask = this.tasks[event.currentIndex];
    this.taskDropped.emit({ task: movedTask, newStatus: this.status });
  }


  /**
   * Handles the drag enter when a card is dragged over the drop list.
   * 
   * @returns {void}
   */
  public onDragEnter(): void {
    this.isDragOver = true;
  }


  /**
   * Handles the drag exit when a card is dragged out of the drop list.
   * 
   * @returns {void}
   */
  public onDragExit(): void {
    this.isDragOver = false;
  }


  /**
   * Opens the add task dialog for the current board section.
   * 
   * @returns {void}
   */
  public onOpenAddTask(): void {
    this.openAddTask.emit(this.status);
  }


  /**
   * Opens the task card for the selected task.
   * 
   * @returns {void}
   */
  public onOpenTaskCard(task: Task): void {
    this.openTaskCard.emit(task);
  }
}
