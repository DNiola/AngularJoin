import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-edge',
  templateUrl: './button-edge.component.html',
  styleUrls: ['./button-edge.component.scss'],
})
export class ButtonEdgeComponent implements OnInit {
  @Input() text = '';
  @Input() iconName? = '';
  
  constructor() { }

  ngOnInit() { }

}
