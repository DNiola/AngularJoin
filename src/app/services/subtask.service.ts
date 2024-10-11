import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subtask } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private subtasksSubject = new BehaviorSubject<Subtask[]>([]);
  subtasks$: Observable<Subtask[]> = this.subtasksSubject.asObservable();

  
  /**
   * Updates the list of subtasks.
   * 
   * @param {Subtask[]} subtasks - The updated list of subtasks.
   * 
   * This method replaces the current list of subtasks with the provided list.
   */
  public updateSubtasks(subtasks: Subtask[]): void {
    this.subtasksSubject.next([...subtasks]);
  }


  /**
   * Adds a new subtask to the existing list of subtasks.
   * 
   * @param {Subtask} subTask - The subtask to be added.
   * 
   * This method adds a new subtask to the current list and emits the updated list.
   */
  public addSubtask(subTask: Subtask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.subtasksSubject.next([...currentSubtasks, subTask]);
  }


  /**
   * Deletes a subtask from the list based on the provided index.
   * 
   * @param {number} index - The index of the subtask to be deleted.
   * 
   * This method removes the subtask at the specified index and emits the updated list.
   */
  public deleteSubtask(index: number): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    this.updateSubtasks(currentSubtasks.filter((_, i) => i !== index));
  }


  /**
   * Updates a specific subtask in the list.
   * 
   * @param {number} index - The index of the subtask to be updated.
   * @param {Subtask} updatedSubtask - The updated subtask information.
   * 
   * This method updates the subtask at the specified index with the new information and emits the updated list.
   */
  public updateSubtask(index: number, updatedSubtask: Subtask): void {
    const currentSubtasks = this.subtasksSubject.getValue();
    currentSubtasks[index] = updatedSubtask;
    this.subtasksSubject.next([...currentSubtasks]);
  }


  /**
   * Clears all subtasks from the list.
   * 
   * This method removes all subtasks and emits an empty list.
   */
  public clearSubtasks(): void {
    this.subtasksSubject.next([]);
  }
}
