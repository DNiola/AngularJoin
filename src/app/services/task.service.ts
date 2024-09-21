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


  // create task in Firestore
  public async createTask(task: Task): Promise<any> {
    const taskRef = this.firestore.collection('tasks').doc();
    const taskId = taskRef.ref.id;
    task.id = taskId;

    return taskRef.set(task)
      .then(() => {
        console.log("Task erfolgreich erstellt mit ID:", taskId);
        return taskId;
      });
  }


  // update task status
  public updateTaskStatus(taskId: string, newStatus: string): Promise<void> {
    return this.firestore.collection('tasks').doc(taskId).update({ status: newStatus });
  }


  // load tasks and optionally filter by title
  public getTasks(searchTerm?: string): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges().pipe(
      map(tasks => {
        if (searchTerm) {
          return tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return tasks;
      })
    );
  }


  // filter tasks by status
  public getTasksByStatus(status: string, searchTerm?: string): Observable<Task[]> {
    return this.getTasks(searchTerm).pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }


  // filter tasks by priority
  public getTasksByPriority(prio: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.prio === prio))
    );
  }
}
