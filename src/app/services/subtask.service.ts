import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private subtasksSubject = new BehaviorSubject<string[]>([]);
  subtasks$: Observable<string[]> = this.subtasksSubject.asObservable();

  public updateSubtasks(subtasks: string[]): void {
    this.subtasksSubject.next([...subtasks]);
  }


  public addSubtask(subtask: string): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.subtasksSubject.next([...currentSubtasks, subtask]);
  }


  public deleteSubtask(index: number): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.updateSubtasks(currentSubtasks.filter((_, i) => i !== index));
  }


  public updateSubtask(index: number, updatedSubtask: string): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    currentSubtasks[index] = updatedSubtask;
    this.subtasksSubject.next([...currentSubtasks]);
  }

  
  public clearSubtasks(): void {
    this.subtasksSubject.next([]);
  }
}