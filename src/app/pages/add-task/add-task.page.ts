import { Component, OnInit } from '@angular/core'; 
import { User } from 'src/app/models/user.model';
import { Subtask } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public currentUser: User | null = null;
  public subtasks: Subtask[] = [];

  constructor(private userService: UserService, private subtaskService: SubtaskService) { }


  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }

}

