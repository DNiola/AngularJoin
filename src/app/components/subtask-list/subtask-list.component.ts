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

  constructor(private subtaskService: SubtaskService) { }

  
  public editSubtask(index: number): void {
    this.editIndex = index;
    this.editedSubtask = this.subtasks[index];
  }


  public saveEdit(): void {
    if (this.editIndex !== null) {
      this.subtaskService.updateSubtask(this.editIndex, this.editedSubtask);
      this.subtasks[this.editIndex] = this.editedSubtask;
      this.editIndex = null;
      this.editedSubtask = { title: '', done: false };
    }
  }


  public cancelEdit(): void {
    this.editIndex = null;
    this.editedSubtask = { title: '', done: false };
  }



  public deleteSubtask(index: number): void {
    this.subtaskService.deleteSubtask(index);
  }
}
