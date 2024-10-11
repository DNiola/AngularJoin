import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  
  /**
   * Starts the drag event and passes the task being dragged.
   *
   * @param {DragEvent} event - The drag event triggered by the user.
   * @param {Task} task - The task being dragged.
   * @returns {void}
   */
  public onDragStart(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('text/plain', task.id);
    this.taskDropped.emit({ task: task, newStatus: this.status });
  }

  
  /**
   * Allows the drop event to occur.
   *
   * @param {DragEvent} event - The drag event triggered during the drag over.
   * @returns {void}
   */
  public allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  
  /**
   * Handles the drop event and updates the task status.
   *
   * @param {DragEvent} event - The drop event triggered by the user.
   * @returns {void}
   */
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    const newStatus = this.status;
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
   * @param {Task} task - The task to be viewed or edited.
   * @returns {void}
   */
  public onOpenTaskCard(task: Task): void {
    this.openTaskCard.emit(task);
  }
}
