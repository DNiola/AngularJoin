import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Subtask } from 'src/app/models/task.model';

@Component({
  selector: 'app-creator-input-field',
  templateUrl: './creator-input-field.component.html',
  styleUrls: ['./creator-input-field.component.scss'],
})
export class CreatorInputFieldComponent {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';

  @Input() subtasks: Subtask[] = [];
  @Output() selectedData = new EventEmitter<Subtask[]>();

  public newSubtask: Subtask = { title: '', done: false };
  public isClicked = false;


  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * Updates the subtasks list when changes are detected.
   * 
   * @param {SimpleChanges} changes - The changes that have been detected.
   * @returns {void}
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['subtasks']) {
      this.subtasks = [...changes['subtasks'].currentValue];
    }
  }


  /**
   * Adds a new subtask to the list of subtasks.
   * Emits the updated list of subtasks through the selectedData output.
   * 
   * @returns {void}
   */
  public addSubtask(): void {
    if (this.newSubtask.title.trim()) {
      this.subtasks.push(this.newSubtask);
      this.selectedData.emit([...this.subtasks]);
      this.newSubtask = { title: '', done: false };
    }
  }

}
