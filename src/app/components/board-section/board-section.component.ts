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
  @Input() status = 'todo';

  @Output() taskDropped = new EventEmitter<{ task: Task, newStatus: string }>();


  // start the drag event and pass the task
  onDragStart(event: DragEvent, task: Task) {
    event.dataTransfer?.setData('text/plain', task.id); 
    this.taskDropped.emit({ task: task, newStatus: this.status });
  }


  // Allow drop
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  
  // Pass the event on drop
  onDrop(event: DragEvent) {
    event.preventDefault();
    const newStatus = this.status;  
  }

}