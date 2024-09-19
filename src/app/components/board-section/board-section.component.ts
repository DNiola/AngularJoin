import { Component, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-board-section',
  templateUrl: './board-section.component.html',
  styleUrls: ['./board-section.component.scss'],
})
export class BoardSectionComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() tasks: Task[] = [];
}
