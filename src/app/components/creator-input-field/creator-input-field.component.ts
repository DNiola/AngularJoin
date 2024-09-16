import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-creator-input-field',
  templateUrl: './creator-input-field.component.html',
  styleUrls: ['./creator-input-field.component.scss'],
})
export class CreatorInputFieldComponent {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';

  subtasks: string[] = [];
  newSubtask: string = '';
  editIndex: number | null = null;

  isClicked = false;
  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask.trim());
      this.newSubtask = '';
    }
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.editIndex = index;
  }

  saveEdit() {
    this.editIndex = null;
  }

  cancelEdit() {
    this.editIndex = null;
  }
}
