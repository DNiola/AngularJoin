import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-big-title',
  templateUrl: './big-title.component.html',
  styleUrls: ['./big-title.component.scss'],
})
export class BigTitleComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() status: Task['status'] = 'todo';

  @Output() openAddTask = new EventEmitter<string>();

  public hovered = false;


  public onOpenAddTask(): void {
    this.openAddTask.emit(this.status);
  }

}
