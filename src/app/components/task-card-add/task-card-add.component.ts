import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeMessage } from 'src/app/models/badge-messages.model';
import { Category, Categorys } from 'src/app/models/category.model';
import { Contact } from 'src/app/models/contact.model';
import { Subtask, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task-card-add',
  templateUrl: './task-card-add.component.html',
  styleUrls: ['./task-card-add.component.scss'],
})
export class TaskCardAddComponent implements OnInit {
  @Input() public taskStatus: Task['status'] = 'todo';
  @Input() public currentUser: User | null = null;
  @Input() public editTask: Task | null = null;
  @Input() public subtasks: Subtask[] = [];
  @Input() public contacts: Contact[] = [];

  @Input() public isCard = false;
  @Input() public isEditTask = false;

  @Output() isCardOpen = new EventEmitter<void>();
  @Output() badgeAnimation = new EventEmitter<BadgeMessage>();

  public categories: Categorys = [
    { name: 'Technical Task', selected: false, color: '#1FD7C1' },
    { name: 'User History', selected: false, color: '#0038FF' },
  ];

  public currentTask: Task = { title: '', dueDate: '', category: { name: '', selected: false, color: '' }, creatorId: this.currentUser?.userId || '', id: '', status: 'todo' };
  public dialogMessage = { title: '', message: '', action: '' };

  public isError = { title: false, dueDate: false, category: false };
  public resetTrigger = false;
  public isCardClosed = false;

  public selectedBubble: Contact[] = [];
  public activeButton = '';

  public isDialog = false;
  public isLoading = false;

  constructor(private userService: UserService, private subtaskService: SubtaskService, private taskService: TaskService, private router: Router) { }


  /**
    * Initializes the component by setting up the current task if in edit mode.
    *
    * @returns {void}
    */
  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.contactsInit(this.currentUser!);
    });

    if (this.isEditTask) {
      this.currentTask = { ...this.editTask } as Task;
      this.taskStatus = this.editTask?.status as Task['status'];
      this.selectedBubble = this.currentTask.assignedTo || [];
      this.activeButton = this.currentTask.prio || '';
      this.subtasks = this.currentTask.subtasks || [];
    }

  }


  /**
   * Initializes the contacts by fetching all users and filtering out the current user's hidden contacts.
   *
   * @param {User} currentUser - The current user to filter out hidden contacts.
   * @returns {void}
   */
  public contactsInit(currentUser: User): void {
    if (this.currentUser) {
      this.userService.getAllUsers().then(users => {
        const userContacts = users as Contact[];
        const personalContacts = currentUser?.contacts || [];
        const visibleUserContacts = userContacts.filter((contact) => !currentUser?.hidden?.includes(contact.userId));
        this.contacts = [...visibleUserContacts, ...personalContacts].map(contact => {
          const newContact = { ...contact, selected: false };
          if (contact?.userId === currentUser?.userId) {
            newContact.name = `${contact.name} (You)`;
          }
          return newContact;
        });
      });
    }
  }


  /**
   * Handles the creation or editing of a task based on the provided flag.
   * Validates required fields before proceeding.
   *
   * @param {boolean} isCreate - A flag indicating whether to create or edit the task.
   * @returns {void}
   */
  public onCreateTask(isCreate: boolean): void {
    this.checkRequiredFields();
    if (this.isError.title || this.isError.dueDate || this.isError.category) {
      this.isDialog = false;
      return;
    }
    this.getTaskData();
    if (isCreate) {
      this.createTask();
    } else {
      this.editTaskData();
    }
  }


  /**
   * Edits the task by updating it in the task service.
   *
   * @returns {void}
   */
  public editTaskData(): void {
    this.isLoading = true;
    this.taskService.updateTask(this.currentTask).then(() => {
      this.badgeAnimation.emit({ status: true, message: 'Task was sucessfully edited' });
      this.onCloseCard();
    }).catch(error => {
      this.badgeAnimation.emit({ status: true, message: 'Uups, somthing goes wrong!', error: true });
      this.isLoading = false;
    });
  }


  /**
   * Gathers all the necessary data for the task, such as priority, creator ID, subtasks, and status.
   *
   * @returns {void}
   */
  private getTaskData(): void {
    this.currentTask.prio = this.activeButton;
    if (this.currentTask.prio === '') {
      this.currentTask.prio = 'medium';
    }

    if (this.currentUser) {
      this.currentTask.creatorId = this.currentUser.userId;
    }
    this.currentTask.subtasks = this.subtasks;
    this.currentTask.status = this.taskStatus;
  }


  /**
   * Checks if the required fields (title, due date, category) are filled.
   * Updates the `isError` object accordingly.
   *
   * @returns {void}
   */
  private checkRequiredFields(): void {
    this.isError = { title: false, dueDate: false, category: false };

    if (this.currentTask.title === '') {
      this.isError.title = true;
    }
    if (this.currentTask.dueDate === '') {
      this.isError.dueDate = true;
    }
    if (this.currentTask.category.name === '' || !this.currentTask.category.name) {
      this.isError.category = true;
    }
  }


  /**
   * Creates a new task by using the task service to save it to the database.
   * Shows animation and navigates to the board page upon success.
   *
   * @returns {void}
   */
  private createTask(): void {
    this.isLoading = true;
    this.taskService.createTask(this.currentTask)
      .then(() => {
        this.badgeAnimation.emit({ status: true, message: 'Task was sucessfully created' });
        this.onCloseCard();
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/board']);
        }, 1000);
      })
      .catch(error => {
        this.isLoading = false;
        this.badgeAnimation.emit({ status: true, message: 'Uups, somthing goes wrong!', error: true });
      });
  }


  /**
   * Clears the current task and resets various fields and states to their default values.
   *
   * @returns {void}
   */
  public clearTask(): void {
    this.activeButton = '';
    this.selectedBubble = [];
    this.resetTrigger = true;
    this.isDialog = false;
    this.subtaskService.clearSubtasks();
    this.contacts = this.contacts.map(contact => { return { ...contact, selected: false } });
    this.currentTask = { title: '', dueDate: '', category: { name: '', selected: false, color: '' }, creatorId: this.currentUser?.userId ?? '', status: 'todo', id: '' };
    setTimeout(() => {
      this.resetTrigger = false;
      this.badgeAnimation.emit({ status: false, message: '', error: false });
    }, 1000);
  }


  /**
   * Sets task data for a specific section based on the provided data and section identifier.
   *
   * @param {string | Category | Contact[]} data - The data to be set for the task.
   * @param {string} section - The section of the task to be updated (e.g., 'title', 'description').
   * @returns {void}
   */
  public setTaskData(data: string | Category | Contact[] | any, section: string): void {
    switch (section) {
      case 'title':
        this.currentTask.title = data as string;
        break;
      case 'description':
        this.currentTask.description = data as string;
        break;
      case 'dueDate':
        this.currentTask.dueDate = data as string;
        break;
      case 'assignedTo':
        this.currentTask.assignedTo = data as Contact[];
        break;
      case 'category':
        this.currentTask.category = data as Category;
        break;
      default:
        console.warn(`Unbekanntes Feld: ${section}`);
    }
  }


  /**
   * Displays the selected contacts in a bubble format and updates the task data.
   *
   * @param {Contact[]} selectedContacts - The selected contacts to be displayed as bubbles.
   * @param {string} section - The section of the task to be updated.
   * @returns {void}
   */
  public onDisplayedBubble(selectedContacts: Contact[], section: string): void {
    this.selectedBubble = selectedContacts;
    this.setTaskData(selectedContacts, section);
  }


  /**
   * Sets the active priority button and updates the task's priority value.
   *
   * @param {string} button - The priority button that is set as active.
   * @returns {void}
   */
  public setActiveButton(button: string): void {
    this.activeButton = button;
    this.setTaskData(this.activeButton, 'prio');
  }


  /**
   * Checks if the provided priority button is active.
   *
   * @param {string} button - The priority button to be checked.
   * @returns {boolean} Returns true if the button is active, otherwise false.
   */
  public isButtonActive(button: string): boolean {
    return this.activeButton === button;
  }


  /**
   * Displays the subtasks and updates the subtask service.
   *
   * @param {Subtask[]} newSubtasks - The subtasks to be displayed and updated.
   * @returns {void}
   */
  public onDisplayedSubtask(newSubtasks: Subtask[]): void {
    this.subtaskService.updateSubtasks(newSubtasks);
  }


  /**
   * Opens a dialog with a specified action (clear, create, edit).
   *
   * @param {'clear' | 'create' | 'edit'} action - The action to be performed when the dialog is confirmed.
   * @returns {void}
   */
  public onOpenDialog(action: 'clear' | 'create' | 'edit'): void {
    if (action === 'clear') {
      this.dialogMessage = { title: 'Clear Task?', message: 'Are you sure you want to clear the task?', action: action }
    } if (action === 'create') {
      this.dialogMessage = { title: 'Create Task?', message: 'Are you sure you want to create the task?', action: action }
    } else {
      this.dialogMessage = { title: 'Edit Task?', message: 'Are you sure you want to edit the task?', action: action }
    }
    this.isDialog = true;
  }


  /**
   * Closes the task card, clears the task data, and emits an event to notify the parent component.
   *
   * @returns {void}
   */
  public onCloseCard(): void {
    this.clearTask();
    this.isCardOpen.emit();
  }
}