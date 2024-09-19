import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-box',
  templateUrl: './overview-box.component.html',
  styleUrls: ['./overview-box.component.scss'],
})
export class OverviewBoxComponent {
  @Input() text = '';
  @Input() icon = '';
  @Input() number = 0;
  @Input() longBox = false;
  @Input() taskDeadline: string | null = null;

  public isHovered = false;

}
