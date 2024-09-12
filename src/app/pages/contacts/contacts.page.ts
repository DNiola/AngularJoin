import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  public currentUser: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
