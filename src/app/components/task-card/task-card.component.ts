import { Component, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input() task: Task | null = null;
  public cardTitle: string = '';
  constructor() {


  }
  ngOnInit() {
    if (Array.isArray(this.task?.category) && this.task?.category.length > 0) { 
      this.cardTitle = this.task.category[0].text;
    }
  }
}
