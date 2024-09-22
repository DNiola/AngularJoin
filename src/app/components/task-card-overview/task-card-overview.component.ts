import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Subtask, Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-card-overview',
  templateUrl: './task-card-overview.component.html',
  styleUrls: ['./task-card-overview.component.scss'],
})
export class TaskCardOverviewComponent implements OnInit {
  @Input() task: Task | null = null;
  
  @Output() isCardOpen = new EventEmitter<void>();
  
  public category: Category | null = null;

  constructor() { }

  public ngOnInit(): void {
    this.initCategory();
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

}
