import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prio-button',
  templateUrl: './prio-button.component.html',
  styleUrls: ['./prio-button.component.scss'],
})
export class PrioButtonComponent implements OnInit {
  @Input() color = ''; 
  @Input() text = '';
  @Input() icon = '';
  constructor() { }

  ngOnInit() { }

}
