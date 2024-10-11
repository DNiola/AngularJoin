import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Subtask, Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() public task: Task | null = null;

  public category: Category | null = null;
  public doneSubtasks: Subtask[] = [{ title: '', done: false }];
  public percentDoneSubtasks = 0;

  
  /**
   * Initializes the component by setting up the subtasks.
   * 
   * @returns {void}
   */
  public ngOnInit(): void {
    this.initSubtasks();
  }

  
  /**
   * Initializes the done subtasks and calculates the percentage of completed subtasks.
   * 
   * Filters the subtasks marked as done and calculates the percentage of completed subtasks.
   * 
   * @returns {void}
   */
  private initSubtasks(): void {
    this.doneSubtasks = this.task?.subtasks?.filter(subtask => subtask.done) || [];
    this.percentDoneSubtasks = (this.doneSubtasks.length / (this.task?.subtasks?.length || 1)) * 100;
  }
}
