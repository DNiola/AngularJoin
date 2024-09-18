import { Component, OnInit, Input } from '@angular/core';
import { SubtaskService } from 'src/app/services/subtask.service';

@Component({
  selector: 'app-subtask-list',
  templateUrl: './subtask-list.component.html',
  styleUrls: ['./subtask-list.component.scss'],
})
export class SubtaskListComponent implements OnInit {
  @Input() subtasks: string[] = [];
  public isHoverOboveSubtask: boolean[] = [];

  public editIndex: number | null = null;
  public editedSubtask: string = '';

  constructor(private subtaskService: SubtaskService) { }

  ngOnInit() { }

  public editSubtask(index: number): void {
    this.editIndex = index;
    this.editedSubtask = this.subtasks[index];
  }

  public saveEdit(): void {
    if (this.editIndex !== null) {
      this.subtaskService.updateSubtask(this.editIndex, this.editedSubtask);
      this.subtasks[this.editIndex] = this.editedSubtask;
      this.editIndex = null;
      this.editedSubtask = '';
    }
  }

  public cancelEdit(): void {
    this.editIndex = null;
    this.editedSubtask = '';
  }

  public deleteSubtask(index: number): void {
    this.subtaskService.deleteSubtask(index);  
  }
}
