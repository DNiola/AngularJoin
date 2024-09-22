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


  // start the drag event and pass the task
  public onDragStart(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('text/plain', task.id);
    this.taskDropped.emit({ task: task, newStatus: this.status });
  }


  // Allow drop
  public allowDrop(event: DragEvent): void {
    event.preventDefault();
  }


  // Pass the event on drop
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    const newStatus = this.status;
  }


  public onOpenAddTask(): void {
    this.openAddTask.emit(this.status);
  }


  public onOpenTaskCard(task: Task): void {
    this.openTaskCard.emit(task);
  }

}