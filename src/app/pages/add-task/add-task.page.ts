import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;

  public contacts: Array<any> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange' },
    { name: 'Anton Mayer', initials: 'A M', color: 'red' },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow' },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green' },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray' },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue' },
  ];

  constructor(private userService: UserService) { }

  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

}
