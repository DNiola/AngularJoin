import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { formatDate } from '@angular/common';

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

  constructor(private userService: UserService, private taskService: TaskService) { }

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

 
  private calculateUpcomingDeadline(): void {
    if (this.urgentTasks.length > 0) {
      // Find the task with the earliest due date
      const nextDeadlineTask = this.urgentTasks.reduce((earliest, current) => {
        const currentDate = new Date(current.dueDate);
        return currentDate < new Date(earliest.dueDate) ? current : earliest;
      });

      // Format the due date as "Month Day, Year"
      this.upcomingDeadline = formatDate(nextDeadlineTask.dueDate, 'MMMM d, y', 'en-US');
    } else {
      this.upcomingDeadline = null;
      console.log('No urgent tasks found.');
    }
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
