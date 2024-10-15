import { Component, OnInit } from '@angular/core';
import { Subtask } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public subtasks: Subtask[] = [];
  public isAnimation = false;

  constructor(private subtaskService: SubtaskService) { }

  /**
   * Initializes the AddTaskPage component.
   *
   * Subscribes to the currentUser and subtasks observables to keep track of the user and subtask data.
   * Populates the contacts list based on the current user.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }


  /**
   * Change the animation state of the AddTaskPage component.
   *
   * @param {boolean} animationStatus - The new animation state.
   * @returns {void}
   */
  public triggerAnimation(animationStatus: boolean): void {
    this.isAnimation = animationStatus;
  }

}
