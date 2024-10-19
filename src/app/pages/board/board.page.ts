import { Component, HostListener, OnInit } from '@angular/core';
import { BadgeMessage } from 'src/app/models/badge-messages.model';
import { Contact } from 'src/app/models/contact.model';
import { Subtask, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  public todoTasks: Task[] = [];
  public inProgressTasks: Task[] = [];
  public awaitFeedbackTasks: Task[] = [];
  public doneTasks: Task[] = [];
  public subtasks: Subtask[] = [];

  public badgeAnimation: BadgeMessage = { status: false, message: '' };
  public currentOpenedTask: Task | null = null;
  public taskStatus: Task['status'] = 'todo';

  public isTaskOverviewOpen = false;
  public isAddTaskOpen = false;
  public isEditTask = false;


  private searchTerm: string = '';

  constructor(private userService: UserService, private taskService: TaskService, private subtaskService: SubtaskService) { }


  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to subtask updates and initializes tasks.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });

    this.tasksInit();
  }


  /**
   * Initializes tasks for each status by fetching them from the task service.
   * Filters tasks based on the current search term.
   *
   * @returns {void}
   */
  private tasksInit(): void {
    this.taskService.getTasksByStatus('todo', this.searchTerm).subscribe(tasks => {
      this.todoTasks = tasks;
    });

    this.taskService.getTasksByStatus('inProgress', this.searchTerm).subscribe(tasks => {
      this.inProgressTasks = tasks;
    });

    this.taskService.getTasksByStatus('awaitFeedback', this.searchTerm).subscribe(tasks => {
      this.awaitFeedbackTasks = tasks;
    });

    this.taskService.getTasksByStatus('done', this.searchTerm).subscribe(tasks => {
      this.doneTasks = tasks;
    });
  }


  /**
   * Opens the add task modal with a specific status pre-selected.
   *
   * @param {'todo' | 'inProgress' | 'awaitFeedback' | 'done'} status - The status for the new task.
   * @returns {void}
   */
  public openAddTask(status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done'): void {
    this.isAddTaskOpen = true;
    this.taskStatus = status;
  }


  /**
   * Closes the add/edit task modal and resets editing states.
   *
   * @returns {void}
   */
  public closeAddTask(): void {
    this.isAddTaskOpen = false;
    this.isEditTask = false;
    this.currentOpenedTask = null;
  }


  /**
   * Opens the task overview modal for the selected task.
   *
   * @param {Task} task - The task to display in the overview.
   * @returns {void}
   */
  public openTaskCard(task: Task): void {
    this.currentOpenedTask = task;
    this.isTaskOverviewOpen = true;
  }


  /**
   * Switches to edit mode for the currently opened task.
   *
   * @returns {void}
   */
  public editTask(): void {
    this.isTaskOverviewOpen = false;
    this.isAddTaskOpen = true;
    this.isEditTask = true;
  }


  /**
   * Handles the search input event, updates the search term, and refreshes task lists.
   *
   * @param {Event} event - The search input event.
   * @returns {void}
   */
  public onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;

    if (inputElement) {
      this.searchTerm = inputElement.value;
      this.tasksInit();
    }
  }


  /**
   * Handles the task dropped event from child components.
   * Updates the task status in the backend.
   *
   * @param {{ task: Task; newStatus: string }} event - The event data containing the task and new status.
   * @returns {void}
   */
  public onTaskDropped(event: { task: Task, newStatus: string }): void {
    this.updateTaskStatus(event.task, event.newStatus);
  }


  /**
   * Allows the global dragover event to prevent default behavior.
   *
   * @param {DragEvent} event - The drag event.
   * @returns {void}
   */
  @HostListener('dragover', ['$event'])
  public onGlobalDragOver(event: DragEvent): void {
    event.preventDefault();
  }


  /**
   * Updates the status of a task in the backend.
   *
   * @param {Task} task - The task to update.
   * @param {string} newStatus - The new status to assign to the task.
   * @returns {void}
   */
  public updateTaskStatus(task: Task, newStatus: string): void {
    this.taskService.updateTaskStatus(task.id, newStatus);
  }


  /**
   * Triggers the badge animation.
   * Sets the badge animation state to the provided badge message and resets it after a delay.
   *
   * @param {BadgeMessage} badge - The badge message containing the animation state, message, and error status.
   * @returns {void}
   */
  public triggerAnimation(badge: BadgeMessage): void {
    this.badgeAnimation = badge;
    setTimeout(() => {
      this.badgeAnimation = { status: false, message: '', error: false };
    }, 1000);
  }


  closeOverlay() {
    if (!this.isEditTask) {
      this.closeAddTask();
      this.isTaskOverviewOpen = false;
    }
  }
}