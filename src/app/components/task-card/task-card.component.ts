import { Component, Input, OnInit } from '@angular/core';
import { Subtask, Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task | null = null;

  public cardTitle = '';
  public colorTitle = '';

  public doneSubtasks: Subtask[] = [{ title: '', done: false }]
  public percentDoneSubtasks = 0;


  public ngOnInit(): void {
    this.initCategory();
    this.initSubtasks();
  }


  private initCategory(): void {
    if (Array.isArray(this.task?.category) && this.task?.category.length > 0) {
      const category = this.task?.category?.[0];
      if (category) {
        this.cardTitle = category.text;
        this.colorTitle = category.color;
      }
    }
  }


  private initSubtasks(): void {
    this.doneSubtasks = this.task?.subtasks?.filter(subtask => subtask.done) || [];
 
    this.percentDoneSubtasks = this.doneSubtasks.length / (this.task?.subtasks?.length || 1) * 100;
   }

}
