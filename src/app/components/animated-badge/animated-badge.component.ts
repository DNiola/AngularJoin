import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-badge',
  templateUrl: './animated-badge.component.html',
  styleUrls: ['./animated-badge.component.scss'],
})
export class AnimatedBadgeComponent {
  @Input() text = '';
  @Input() icon = '';
  @Input() error = false;

}
