import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-button',
  templateUrl: './sidebar-button.component.html',
  styleUrls: ['./sidebar-button.component.scss'],
})
export class SidebarButtonComponent implements OnInit {
  @Input() text = '';
  @Input() icon = '';
  @Input() link = '';

  public isActive: boolean = false;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateActiveState();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {      
      this.updateActiveState();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateActiveState(): void {
    this.isActive = this.router.url.startsWith(this.link);
  }
}
