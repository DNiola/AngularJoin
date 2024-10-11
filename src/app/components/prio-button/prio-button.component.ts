import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prio-button',
  templateUrl: './prio-button.component.html',
  styleUrls: ['./prio-button.component.scss'],
})
export class PrioButtonComponent {
  @Input() color = '';
  @Input() text = '';
  @Input() icon = '';
  @Input() isActive = false;

}
