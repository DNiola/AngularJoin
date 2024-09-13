import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-box',
  templateUrl: './overview-box.component.html',
  styleUrls: ['./overview-box.component.scss'],
})
export class OverviewBoxComponent implements OnInit {
  @Input() text = ''
  @Input() icon = ''
  @Input() number = ''
  @Input() longBox =  false

  public isHovered = false;

  constructor() { }

  ngOnInit() { }

}
