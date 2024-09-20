import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { subTask } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private subtasksSubject = new BehaviorSubject<subTask[]>([]);
  subtasks$: Observable<subTask[]> = this.subtasksSubject.asObservable();


  public updateSubtasks(subtasks: subTask[]): void {
    this.subtasksSubject.next([...subtasks]);
  }


  public addSubtask(subtask: subTask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.subtasksSubject.next([...currentSubtasks, subtask]);
  }


  public deleteSubtask(index: number): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.updateSubtasks(currentSubtasks.filter((_, i) => i !== index));
  }


  public updateSubtask(index: number, updatedSubtask: subTask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    currentSubtasks[index] = updatedSubtask;
    this.subtasksSubject.next([...currentSubtasks]);
  }


  public clearSubtasks(): void {
    this.subtasksSubject.next([]);
  }
  
}