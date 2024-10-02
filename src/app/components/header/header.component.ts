import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('userInitials') userInitials!: ElementRef;

  @Input() currentUser: User | null = null;

  public menuItems = [
    { text: 'Help', href: 'info' },
    { text: 'Legal Notice', href: 'legal' },
    { text: 'Privacy Policy', href: 'policy' }
  ]

  public isDropdownOpen = false
  public isDialog = false;

  constructor(private userService: UserService, private router: Router) { }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.dropdownMenu || !this.userInitials) {
      return;
    }

    const clickedOutsideDropdown = !this.dropdownMenu?.nativeElement.contains(event.target);
    const clickedOutsideInitials = !this.userInitials?.nativeElement.contains(event.target);

    if (clickedOutsideDropdown && clickedOutsideInitials) {
      this.isDropdownOpen = false;
    }
  }


  logout(): void {
    this.isDialog = false;
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
