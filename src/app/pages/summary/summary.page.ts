import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  public currentUser: User | null = null;
  public greeting: string = '';

  constructor(private userService: UserService) { }

 public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.getGreetings();

  }


  private getGreetings(): void {
    const currentHour = new Date().getHours();

    if (currentHour >= 22 || currentHour < 6) {
      this.greeting = 'Good Night';
    } else if (currentHour >= 18) {
      this.greeting = 'Good Evening';
    } else if (currentHour >= 12) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Morning';
    }
  }
}
