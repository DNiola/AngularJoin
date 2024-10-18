import { Component, OnInit } from '@angular/core';
import { BadgeMessage } from 'src/app/models/badge-messages.model';
import { Subtask } from 'src/app/models/task.model';
import { SubtaskService } from 'src/app/services/subtask.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  public subtasks: Subtask[] = [];
  public badgeAnimation: BadgeMessage = { status: false, message: '' };

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
   * Changes the animation state of the AddTaskPage component.
   *
   * This method updates the badge animation state to the provided badge message.
   *
   * @param {BadgeMessage} badge - The new animation state containing the status, message, and error flag.
   * @returns {void}
   */
  public triggerAnimation(badge: BadgeMessage): void {
    this.badgeAnimation = badge;
  }

}
