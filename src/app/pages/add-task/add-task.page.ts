import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;
  public activeButton = '';

  public contacts: Array<Contact> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange' },
    { name: 'Anton Mayer', initials: 'A M', color: 'red' },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow' },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green' },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray' },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue' },
  ];

  public categories: Array<any> = [
    { text: 'Technical Task' },
    { text: 'User history' },
  ];

  constructor(private userService: UserService) { }

  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  isButtonActive(button: string): boolean {
    return this.activeButton === button;
  }
}