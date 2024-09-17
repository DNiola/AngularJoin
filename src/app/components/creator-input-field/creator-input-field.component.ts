import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-creator-input-field',
  templateUrl: './creator-input-field.component.html',
  styleUrls: ['./creator-input-field.component.scss'],
})
export class CreatorInputFieldComponent {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';

  @Input() subtasks: string[] = [];
  @Output() selectedData = new EventEmitter<string[]>();

  public newSubtask: string = '';
  public isClicked = false;

  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['subtasks']) {
      this.subtasks = [...changes['subtasks'].currentValue];
    }
  }


  public addSubtask(): void {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask.trim());
      this.selectedData.emit([...this.subtasks]);
      this.newSubtask = '';
    }
  }

}
