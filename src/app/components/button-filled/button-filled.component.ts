import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-filled',
  templateUrl: './button-filled.component.html',
  styleUrls: ['./button-filled.component.scss'],
})
export class ButtonFilledComponent implements OnInit {
  @Input() text = '';
  @Input() iconName? = '';
  
  constructor() { }

  ngOnInit() { }

}
