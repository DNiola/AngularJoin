import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  public userData: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userData = this.userService.getUser();
    console.log(this.userData);
  }

}
