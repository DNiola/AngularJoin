import { Component, HostListener, OnInit } from '@angular/core';
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

  public currentUser: User | null = null;

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


  public taskStatus: Task['status'] = 'todo';

  private searchTerm: string = '';

  constructor(private userService: UserService, private taskService: TaskService, private subtaskService: SubtaskService) { }


  public ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });

    this.tasksInit();
  }


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


  public openAddTask(status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done'): void {
    this.isAddTaskOpen = true;
    this.taskStatus = status;
  }


  public closeAddTask(): void {
    this.isAddTaskOpen = false;
    this.isEditTask = false;
    this.currentOpenedTask = null;
  }


  public openTaskCard(task: Task): void {
    this.currentOpenedTask = task;
    this.isTaskOverviewOpen = true;
  }


  public editTask(task: Task): void {
    this.isTaskOverviewOpen = false;
    this.isAddTaskOpen = true;
    this.isEditTask = true;
  }


  public onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;

    if (inputElement) {
      this.searchTerm = inputElement.value;
      this.tasksInit();
    }
  }


  // Listener for setting the task that is currently being dragged
  onTaskDragStart(event: { task: Task, newStatus: string }): void {
    this.currentDraggedTask = event.task;
  }


  // listener for allowing the drop event (global)
  @HostListener('dragover', ['$event'])
  onGlobalDragOver(event: DragEvent): void {
    event.preventDefault();
  }


  // Listener for the drop event (global)
  @HostListener('drop', ['$event'])
  onGlobalDrop(event: DragEvent): void {
    event.preventDefault();
    let targetElement = (event.target as HTMLElement).closest('[data-status]');
    const targetStatus = targetElement ? targetElement.getAttribute('data-status') : null;

    if (this.currentDraggedTask && targetStatus) {
      this.updateTaskStatus(this.currentDraggedTask, targetStatus);
      this.currentDraggedTask = null;
    } else {
      console.log('currentDraggedTask ist null oder targetStatus ist nicht gesetzt.');
    }
  }


  updateTaskStatus(task: Task, newStatus: string): void {
    this.taskService.updateTaskStatus(task.id, newStatus).then(() => {
      console.log(`Task mit ID ${task.id} wurde nach ${newStatus} verschoben.`);
    });
  }

}