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

  @Input() currentUser: User | null = null;

  public menuItems = [
    { text: 'Help', href: '/help' },
    { text: 'Legal Notice', href: '/legal-notice' },
    { text: 'Privacy Policy', href: '/privacy-policy' }
  ]

  public isDropdownOpen = false
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('userInitials') userInitials!: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    // make sure the elements exist before accessing them
    if (!this.dropdownMenu || !this.userInitials) {
      return;  // exit if the elements do not exist
    }

    const clickedOutsideDropdown = !this.dropdownMenu?.nativeElement.contains(event.target); // check if clicked outside the dropdown
    const clickedOutsideInitials = !this.userInitials?.nativeElement.contains(event.target); // check if clicked outside the initials

    if (clickedOutsideDropdown && clickedOutsideInitials) {
      this.isDropdownOpen = false; // close the dropdown if clicked outside
    }
  }


  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
