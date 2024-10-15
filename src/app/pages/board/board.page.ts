import { Component, HostListener, OnInit } from '@angular/core';
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

  public currentDraggedTask: Task | null = null;
  public currentOpenedTask: Task | null = null;

  public isTaskOverviewOpen = false;
  public isAddTaskOpen = false;
  public isEditTask = false;
  public isAnimation = false;

  public taskStatus: Task['status'] = 'todo';

  private searchTerm: string = '';

  constructor(private userService: UserService, private taskService: TaskService, private subtaskService: SubtaskService) { }


  /**
   * Initializes the board page by setting up user, tasks, and subtasks.
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
   * Opens the add task section with a specific status.
   *
   * @param {'todo' | 'inProgress' | 'awaitFeedback' | 'done'} status - The status for the new task.
   * @returns {void}
   */
  public openAddTask(status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done'): void {
    this.isAddTaskOpen = true;
    this.taskStatus = status;
  }


  /**
   * Closes the add task section and resets editing state.
   *
   * @returns {void}
   */
  public closeAddTask(): void {
    this.isAddTaskOpen = false;
    this.isEditTask = false;
    this.currentOpenedTask = null;
  }


  /**
   * Opens the task card overview for a specific task.
   *
   * @param {Task} task - The task to be opened in the overview.
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
   * Handles the search input event and updates the task list based on the search term.
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
   * Sets the task that is currently being dragged.
   *
   * @param {{ task: Task, newStatus: string }} event - The drag event containing the task and its new status.
   * @returns {void}
   */
  public onTaskDragStart(event: { task: Task, newStatus: string }): void {
    this.currentDraggedTask = event.task;
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
   * Handles the global drop event and updates the task status.
   *
   * @param {DragEvent} event - The drop event.
   * @returns {void}
   */
  @HostListener('drop', ['$event'])
  public onGlobalDrop(event: DragEvent): void {
    event.preventDefault();
    let targetElement = (event.target as HTMLElement).closest('[data-status]');
    const targetStatus = targetElement ? targetElement.getAttribute('data-status') : null;

    if (this.currentDraggedTask && targetStatus) {
      this.updateTaskStatus(this.currentDraggedTask, targetStatus);
      this.currentDraggedTask = null;
    }
  }


  /**
   * Updates the status of a task.
   *
   * @param {Task} task - The task to be updated.
   * @param {string} newStatus - The new status to assign to the task.
   * @returns {void}
   */
  public updateTaskStatus(task: Task, newStatus: string): void {
    this.taskService.updateTaskStatus(task.id, newStatus);
  }


  /**
   * Triggers the task animation by setting the animation state to true.
   *
   * @param {boolean} animationStatus - The animation state to be set.
   * @returns {void}
   */
  public triggerAnimation(animationStatus: boolean): void {
    this.isAnimation = animationStatus;
    setTimeout(() => {
      this.isAnimation = false;
    }, 1000);
  }

}
