import { Component, Input } from '@angular/core';
import { Subtask } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';

@Component({
  selector: 'app-subtask-list',
  templateUrl: './subtask-list.component.html',
  styleUrls: ['./subtask-list.component.scss'],
})
export class SubtaskListComponent {
  @Input() subtasks: Subtask[] = [];

  public isHoverOboveSubtask: boolean[] = [];

  public editIndex: number | null = null;
  public editedSubtask: Subtask = { title: '', done: false };

  constructor(private subtaskService: SubtaskService) {}

  
  /**
   * Initiates the editing of a subtask.
   *
   * @param {number} index - The index of the subtask to be edited.
   * @returns {void}
   */
  public editSubtask(index: number): void {
    this.editIndex = index;
    this.editedSubtask = { ...this.subtasks[index] };
  }

  
  /**
   * Saves the edited subtask and updates the subtask list.
   *
   * @returns {void}
   */
  public saveEdit(): void {
    if (this.editIndex !== null) {
      this.subtasks[this.editIndex] = this.editedSubtask;
      this.subtasks = this.subtasks;
      this.subtaskService.updateSubtasks(this.subtasks);
      this.editIndex = null;
      this.editedSubtask = { title: '', done: false };
    }
  }

  
  /**
   * Cancels the edit mode for a subtask.
   *
   * @returns {void}
   */
  public cancelEdit(): void {
    this.editIndex = null;
    this.editedSubtask = { title: '', done: false };
  }

  
  /**
   * Deletes a subtask from the list.
   *
   * @param {number} index - The index of the subtask to be deleted.
   * @returns {void}
   */
  public deleteSubtask(index: number): void {
    this.subtaskService.deleteSubtask(index);
  }
}