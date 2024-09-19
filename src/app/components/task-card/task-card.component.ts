import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {

  @Input() task: Task | null = null;

  public cardTitle: string = '';
  public colorTitle: string = '';

  ngOnInit() {
    if (Array.isArray(this.task?.category) && this.task?.category.length > 0) {
      this.cardTitle = this.task.category[0].text;
      this.colorTitle = this.task.category[0].color; 
    }
  }
}
