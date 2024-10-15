import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-edge',
  templateUrl: './button-edge.component.html',
  styleUrls: ['./button-edge.component.scss'],
})
export class ButtonEdgeComponent {
  @Input() text = '';
  @Input() iconName? = '';
  @Input() disabled = false;
  
}
