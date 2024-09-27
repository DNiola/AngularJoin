import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-badge',
  templateUrl: './animated-badge.component.html',
  styleUrls: ['./animated-badge.component.scss'],
})
export class AnimatedBadgeComponent  implements OnInit {
@Input() text = '';
@Input() icon = '';
  constructor() { }

  ngOnInit() {}

}
