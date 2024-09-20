import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { subTask } from 'src/app/models/task.model';

@Component({
  selector: 'app-creator-input-field',
  templateUrl: './creator-input-field.component.html',
  styleUrls: ['./creator-input-field.component.scss'],
})
export class CreatorInputFieldComponent {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';

  @Input() subtasks: subTask[] = [];
  @Output() selectedData = new EventEmitter<subTask[]>();

  public newSubtask: subTask = { title: '', done: false };
  public isClicked = false;


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['subtasks']) {
      this.subtasks = [...changes['subtasks'].currentValue];
    }
  }


  public addSubtask(): void {
    if (this.newSubtask.title.trim()) {
      this.subtasks.push(this.newSubtask);
      this.selectedData.emit([...this.subtasks]);
      this.newSubtask = { title: '', done: false };
    }
  }

}
