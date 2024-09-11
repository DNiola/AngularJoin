import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-button',
  templateUrl: './sidebar-button.component.html',
  styleUrls: ['./sidebar-button.component.scss'],
})
export class SidebarButtonComponent implements OnInit {
  @Input() text = ''
  @Input() icon = ''
  @Input() link = ''

  public active = false

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.router.url === this.link && !this.active) {
      this.active = true
      return
    }
  }
}
