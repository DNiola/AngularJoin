import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {

  public currentUser: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
