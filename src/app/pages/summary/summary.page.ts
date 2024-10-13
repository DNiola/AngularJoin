import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  public currentUser: User | null = null;

  public greeting: string = '';
  public upcomingDeadline: string | null = null;

  public todoTasks: Task[] = [];
  public inProgressTasks: Task[] = [];
  public awaitFeedbackTasks: Task[] = [];
  public doneTasks: Task[] = [];
  public urgentTasks: Task[] = [];
  public allTasks: Task[] = [];

  constructor(private userService: UserService, private taskService: TaskService, private router: Router) { }


  /**
   * Initializes the component, subscribes to user and task data.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.allTasks = tasks;
    });

    this.taskService.getTasksByStatus('todo').subscribe((tasks) => {
      this.todoTasks = tasks;
    });

    this.taskService.getTasksByStatus('inProgress').subscribe((tasks) => {
      this.inProgressTasks = tasks;
    });

    this.taskService.getTasksByStatus('awaitFeedback').subscribe((tasks) => {
      this.awaitFeedbackTasks = tasks;
    });

    this.taskService.getTasksByStatus('done').subscribe((tasks) => {
      this.doneTasks = tasks;
    });

    this.taskService.getTasksByPriority('urgent').subscribe((tasks) => {
      this.urgentTasks = tasks;
      this.calculateUpcomingDeadline();
    });
    
    this.getGreetings();
  }


  /**
   * Calculates the upcoming deadline from the list of urgent tasks.
   * Sets the upcomingDeadline property to the formatted date of the earliest urgent task.
   *
   * @returns {void}
   */
  private calculateUpcomingDeadline(): void {
    if (this.urgentTasks.length > 0) {
      const nextDeadlineTask = this.urgentTasks.reduce((earliest, current) => {
        const currentDate = new Date(current.dueDate);
        return currentDate < new Date(earliest.dueDate) ? current : earliest;
      });

      this.upcomingDeadline = formatDate(nextDeadlineTask.dueDate, 'MMMM d, y', 'en-US');
    } else {
      this.upcomingDeadline = null;
    }
  }


  /**
   * Determines the appropriate greeting based on the current time of day.
   * Sets the greeting property to a string such as 'Good Morning', 'Good Afternoon', etc.
   *
   * @returns {void}
   */
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


  /**
   * Navigates the user to the board page.
   *
   * @returns {void}
   */
  public onRouteToBoard(): void {
    this.router.navigate(['/board']);
  }
}
