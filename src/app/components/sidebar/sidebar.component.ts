import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})


export class SidebarComponent {
  public currentUser: User | null = null;

  constructor(private userService: UserService) { }

  public ngOnInit(): void {
     this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

}
