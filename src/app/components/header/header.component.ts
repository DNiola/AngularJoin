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
    { text: 'Help', link: 'info' },
    { text: 'Legal Notice', link: 'legal' },
    { text: 'Privacy Policy', link: 'policy' }
  ];

  public isDropdownOpen = false;
  public isDialog = false;
  public isAnimation = false;

  constructor(private userService: UserService, private router: Router) { }

  
  /**
   * Initializes the header component by subscribing to the current user data.
   * 
   * @returns {void}
   */
  public ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }


  /**
   * Handles click events outside of the dropdown menu and user initials to close the dropdown.
   * 
   * @param {MouseEvent} event - The mouse event triggered by clicking on the document.
   * @returns {void}
   */
  @HostListener('document:click', ['$event'])
  public handleClickOutside(event: MouseEvent): void {
    if (!this.dropdownMenu || !this.userInitials) {
      return;
    }

    const clickedOutsideDropdown = !this.dropdownMenu?.nativeElement.contains(event.target);
    const clickedOutsideInitials = !this.userInitials?.nativeElement.contains(event.target);

    if (clickedOutsideDropdown && clickedOutsideInitials) {
      this.isDropdownOpen = false;
    }
  }


  /**
   * Logs out the current user, shows a logout animation, and redirects to the login page.
   * 
   * @returns {void}
   */
  public onLogout(): void {
    this.isDialog = false;
    this.isAnimation = true;
    this.userService.clearUser();
    setTimeout(() => {
      this.isAnimation = false;
      this.router.navigate(['/login']);
    }, 1000);
  }
}
