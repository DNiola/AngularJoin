import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subtask } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private subtasksSubject = new BehaviorSubject<Subtask[]>([]);
  subtasks$: Observable<Subtask[]> = this.subtasksSubject.asObservable();


  public updateSubtasks(subtasks: Subtask[]): void {
    this.subtasksSubject.next([...subtasks]);
  }


  public addSubtask(subTask: Subtask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.subtasksSubject.next([...currentSubtasks, subTask]);
  }


  public deleteSubtask(index: number): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.updateSubtasks(currentSubtasks.filter((_, i) => i !== index));
  }


  public updateSubtask(index: number, updatedSubtask: Subtask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    currentSubtasks[index] = updatedSubtask;
    this.subtasksSubject.next([...currentSubtasks]);
  }


  public clearSubtasks(): void {
    this.subtasksSubject.next([]);
  }
  
}