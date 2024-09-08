import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-checkbox',
  templateUrl: './auth-checkbox.component.html',
  styleUrls: ['./auth-checkbox.component.scss'],
})
export class AuthCheckboxComponent implements OnInit {
  @Input() text = '';
  @Input() link = '';
  @Input() linkText = '';
  constructor() { }

  ngOnInit() { }

  hasLink(): boolean {
    return this.link !== '';  // check if the link is not empty
  }
}
