import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-section',
  templateUrl: './board-section.component.html',
  styleUrls: ['./board-section.component.scss'],
})
export class BoardSectionComponent  implements OnInit {
  @Input() title: string = ''; 
  @Input() icon: string = '';
  constructor() { }

  ngOnInit() {}

}
