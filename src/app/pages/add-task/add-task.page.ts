import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  @Input() selectedData: Contact[] = [];
  @Input() subtasks: string[] = [];

  public currentUser: User | null = null;
  public activeButton = '';

  public editIndex: number | null = null;
  public isHoverOboveSubtask: boolean[] = [];

  public contacts: Array<Contact> = [
    { name: 'Sofia Müller (You)', initials: 'S M', color: 'orange' },
    { name: 'Anton Mayer', initials: 'A M', color: 'red' },
    { name: 'Anja Schulz', initials: 'A S', color: 'yellow' },
    { name: 'Benedikt Ziegler', initials: 'B Z', color: 'green' },
    { name: 'David Eisenberg', initials: 'D E', color: 'gray' },
    { name: 'Elon Dust', initials: 'E D', color: 'darkBlue' },
  ];

  public categories: Array<any> = [
    { text: 'Technical Task' },
    { text: 'User history' },
  ];

  constructor(private userService: UserService, private subtaskService: SubtaskService) { }

  public ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.subtaskService.subtasks$.subscribe((subtasks) => {
      this.subtasks = subtasks;
    });
  }


  public onDisplayedBubble(selectedContacts: Contact[]): void {
    this.selectedData = selectedContacts;
  }


  public setActiveButton(button: string): void {
    this.activeButton = button;
  }


  public isButtonActive(button: string): boolean {
    return this.activeButton === button;
  }


  public onDisplayedSubtask(newSubtasks: string[]): void {
    this.subtaskService.updateSubtasks(newSubtasks);
  }


  public deleteSubtask(index: number): void {
    this.subtaskService.deleteSubtask(index);
  }


  public editSubtask(index: number): void {
    this.editIndex = index;
  }


  public saveEdit(updatedSubtask: string): void {
    if (this.editIndex !== null) {
      this.subtaskService.updateSubtask(this.editIndex, updatedSubtask);
      this.editIndex = null;
    }
  }

  public cancelEdit(): void {
    this.editIndex = null;
  }
}

