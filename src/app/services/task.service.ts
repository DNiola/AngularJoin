import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }


  /**
   * Retrieves all tasks from Firestore.
   *
   * @returns {Observable<Task[]>} An observable that emits the list of all tasks.
   */
  public getAllTasks(): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges();
  }


  /**
   * Creates a new task in Firestore.
   *
   * @param {Task} task - The task object to be created.
   * @returns {Promise<any>} A promise that resolves with the task ID when the task is created.
   */
  public async createTask(task: Task): Promise<any> {
    const taskRef = this.firestore.collection('tasks').doc();
    const taskId = taskRef.ref.id;
    task.id = taskId;

    return taskRef.set(task)
      .then(() => { return taskId; });
  }


  /**
   * Updates an existing task in Firestore.
   *
   * @param {Task} task - The task object containing updated data.
   * @returns {Promise<void>} A promise that resolves when the task is updated.
   */
  public async updateTask(task: Task): Promise<void> {
    if (task.id) {
      return this.firestore.collection('tasks').doc(task.id).update(task);
    } else {
      return Promise.reject('Task ID is missing.');
    }
  }


  /**
   * Updates the status of a task.
   *
   * @param {string} taskId - The ID of the task to be updated.
   * @param {string} newStatus - The new status of the task.
   * @returns {Promise<void>} A promise that resolves when the task status is updated.
   */
  public updateTaskStatus(taskId: string, newStatus: string): Promise<void> {
    return this.firestore.collection('tasks').doc(taskId).update({ status: newStatus });
  }


  /**
   * Updates the status of a specific subtask in Firestore.
   *
   * @param {string} taskId - The ID of the task containing the subtask.
   * @param {number} subtaskIndex - The index of the subtask to be updated.
   * @param {boolean} done - The new status of the subtask.
   * @returns {Promise<void>} A promise that resolves when the subtask status is updated.
   */
  public async updateSubtaskStatus(taskId: string, subtaskIndex: number, done: boolean): Promise<void> {
    return this.firestore.collection('tasks').doc(taskId).get().toPromise().then((taskDoc) => {
      const taskData = taskDoc?.data() as Task;

      if (taskData && taskData.subtasks && taskData.subtasks[subtaskIndex]) {
        taskData.subtasks[subtaskIndex].done = done;

        // save task with updated subtask status in Firestore
        return this.firestore.collection('tasks').doc(taskId).update({ subtasks: taskData.subtasks });
      }

      // Add return value if no subtask was found
      return Promise.resolve(); // Returns a resolved promise if no subtasks were found
    });
  }


  /**
   * Updates all tasks that contain the given contact with the new contact details.
   * 
   * @param {string} contactId - The ID of the contact to be updated in tasks.
   * @param {string} newName - The new name of the contact.
   * @param {string} newInitials - The new initials of the contact.
   * @returns {Promise<void>} A promise that resolves when the tasks are updated.
   */
  public async updateTasksWithContact(contactId: string, newName: string, newInitials: string): Promise<void> {
    const tasksSnapshot = await this.firestore.collection<Task>('tasks').get().toPromise();
    const batch = this.firestore.firestore.batch();

    tasksSnapshot?.forEach(doc => {
      const taskData = doc.data() as any;

      const updatedAssignedTo = taskData.assignedTo?.map((contact: any) => {
        if (contact.userId === contactId) {
          return {
            ...contact,
            name: newName,
            initials: newInitials
          };
        }
        return contact;
      });

      if (JSON.stringify(taskData.assignedTo) !== JSON.stringify(updatedAssignedTo)) {
        const taskRef = this.firestore.collection('tasks').doc(doc.id).ref;
        batch.update(taskRef, { assignedTo: updatedAssignedTo });
      }
    });

    await batch.commit();
  }


  /**
   * Retrieves tasks from Firestore, optionally filtered by a search term.
   *
   * @param {string} [searchTerm] - The term to filter tasks by title or description.
   * @returns {Observable<Task[]>} An observable that emits the list of tasks.
   */
  public getTasksBySearchTerm(searchTerm?: string): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges().pipe(
      map(tasks => {
        if (searchTerm) {
          return tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        return tasks;
      })
    );
  }


  /**
   * Retrieves tasks from Firestore filtered by status.
   *
   * @param {string} status - The status to filter tasks by.
   * @param {string} [searchTerm] - An optional search term to further filter tasks.
   * @returns {Observable<Task[]>} An observable that emits the list of filtered tasks.
   */
  public getTasksByStatus(status: string, searchTerm?: string): Observable<Task[]> {
    return this.getTasksBySearchTerm(searchTerm).pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }


  /**
   * Retrieves tasks from Firestore filtered by priority.
   *
   * @param {string} prio - The priority level to filter tasks by.
   * @returns {Observable<Task[]>} An observable that emits the list of filtered tasks.
   */
  public getTasksByPriority(prio: string): Observable<Task[]> {
    return this.getTasksBySearchTerm().pipe(
      map(tasks => tasks.filter(task => task.prio === prio))
    );
  }


  /**
   * Deletes a task from Firestore.
   *
   * @param {string} taskId - The ID of the task to be deleted.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   */
  public deleteTask(taskId: string): Promise<void> {
    return this.firestore.collection('tasks').doc(taskId).delete();
  }
}
