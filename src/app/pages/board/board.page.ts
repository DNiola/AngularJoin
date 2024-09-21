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

  public isAddTaskOpen = false;
  public taskStatus: Task['status'] = 'todo';
  constructor(private userService: UserService, private taskService: TaskService, private subtaskService: SubtaskService) { }


  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
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
  }

  public openAddTask(status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done'): void {
    console.log('Open Add Task:', status)
    this.isAddTaskOpen = true;
    this.taskStatus = status;
  }


  // Listener for setting the task that is currently being dragged
  onTaskDragStart(event: { task: Task, newStatus: string }): void {
    this.currentDraggedTask = event.task;
    console.log('Task Drag Start:', event.task.id);
  }


  // listener for allowing the drop event (global)
  @HostListener('dragover', ['$event'])
  onGlobalDragOver(event: DragEvent): void {
    event.preventDefault();
    console.log('Global Drag Over');
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